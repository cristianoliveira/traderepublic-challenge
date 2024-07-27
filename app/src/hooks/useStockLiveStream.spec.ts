import { describe, it, expect, vi, type Mock, assert } from 'vitest';
import { act, renderHook } from "@testing-library/preact";
import { StockData, useStockLiveStream } from './useStockLiveStream';

class StubedWebSocket implements Partial<WebSocket> {
  addEventListener: Mock;
  send: Mock;
  close: Mock;
  onopen: Mock;
  onmessage: Mock;
  onerror: Mock;
  onclose: Mock;

  private listeners: Array<(event: { data: string }) => void> = [];

  readyState: number = WebSocket.CLOSED;

  constructor() {
    this.addEventListener = vi.fn();
    this.send = vi.fn();
    this.close = vi.fn();
    this.onopen = vi.fn();
    this.onmessage = vi.fn();
    this.onerror = vi.fn();
    this.onclose = vi.fn();
    this.addEventListener.mockImplementation((_, cb) => {
      this.listeners.push(cb);
    });
  }

  triggerOnOpenEvent() {
    this.onopen({} as unknown as Event);
  }

  triggerOnCloseEvent() {
    this.onclose({} as unknown as Event);
  }

  triggerOnErrorEvent() {
    this.onerror({} as unknown as Event);
  }

  triggerOnMessageEvent(data: string) {
    this.listeners.forEach((cb) => cb({ data }));
  }
}

class TimeoutTestError extends Error {
  constructor() {
    super("TimeoutTestError");
    this.name = "TimeoutTestError";
  }
}

describe('useStockLiveStream', () => {
  describe('watching a valid ISIN', () => {
    it('waits for connection before subscribing', () => {
      const stubWebSocket = new StubedWebSocket();
      const validIsin = 'US0378331005';

      const { result } = renderHook(() => useStockLiveStream({ socket: stubWebSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('disconnected');
      expect(stubWebSocket.send).not.toHaveBeenCalled();

      act(() => stubWebSocket.triggerOnOpenEvent());
      expect(result.current?.connectionState).toBe('connected');

      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(stubWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('subscribe when the connection is open', () => {
      const validIsin = 'US0378331005';

      const stubWebSocket = new StubedWebSocket();
      stubWebSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream({ socket: stubWebSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(stubWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('returns da live data on stock change', async () => {
      const validIsin = 'IN8212A01012';

      const stubWebSocket = new StubedWebSocket();
      stubWebSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream({ socket: stubWebSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(stubWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));

      const waitDataForStock = async (isin: string) => {
        return new Promise((resolve, reject) => {
          result.current?.subscribeTo(isin, (data) => {
            resolve(data);
          })
          setTimeout(() => reject(new TimeoutTestError()), 1000);
        });
      }

      const dataAsStr = `{"isin":"IN8212A01012","price":230.1212163887097,"bid":230.11121638870972,"ask":230.1312163887097}`
      // NOTE: This simulate parallel async operations
      const [watchedStockData,] = await Promise.all([
        waitDataForStock("IN8212A01012"), 
        act(() => stubWebSocket.triggerOnMessageEvent(dataAsStr))
      ]) as [StockData | undefined, undefined];
      expect(watchedStockData?.isin).toBe(validIsin);

      try {
        await Promise.all([
          waitDataForStock("US0378331005"), 
          act(() => stubWebSocket.triggerOnMessageEvent(dataAsStr))
        ])

        assert(false, "Must not react to non watched stocks");
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutTestError);
      }
    });
  });

  it('allows you to check the connection status', () => {
    const stubWebSocket = new StubedWebSocket();
    const { result } = renderHook(() => useStockLiveStream({ socket: stubWebSocket as unknown as WebSocket }));

    expect(result.current?.connectionState).toBe('disconnected');

    act(() => stubWebSocket.triggerOnOpenEvent());
    expect(result.current?.connectionState).toBe('connected');

    act(() => stubWebSocket.triggerOnErrorEvent());
    expect(result.current?.connectionState).toBe('connecting');

    act(() => stubWebSocket.triggerOnCloseEvent());
    expect(result.current?.connectionState).toBe('disconnected');
  });

  it.each([
    { isin: '' },
    { isin: 'foo' },
    { isin: 'US037833100' },
    { isin: 'US03783310055' },
  ])('thows an error if ISIN is invalid: $isin', ({ isin }) => {
    const stubWebSocket = new StubedWebSocket();
    const { result } = renderHook(() => useStockLiveStream({ socket: stubWebSocket as unknown as WebSocket }));

    expect(() => result.current.subscribeTo(isin, vi.fn())).toThrow();
  });
});
