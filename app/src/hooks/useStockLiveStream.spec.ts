import { describe, it, expect, vi, type Mock, assert } from 'vitest';
import { act, renderHook } from "@testing-library/preact";
import { StockData, useStockLiveStream } from './useStockLiveStream';

class MockedWebSocket implements Partial<WebSocket> {
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
      const mockSocket = new MockedWebSocket();
      const validIsin = 'US0378331005';

      const { result } = renderHook(() => useStockLiveStream({ socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('disconnected');
      expect(mockSocket.send).not.toHaveBeenCalled();

      act(() => mockSocket.triggerOnOpenEvent());
      expect(result.current?.connectionState).toBe('connected');

      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('subscribe when the connection is open', () => {
      const validIsin = 'US0378331005';

      const mockSocket = new MockedWebSocket();
      mockSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream({ socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('returns da live data on stock change', async () => {
      const validIsin = 'IN8212A01012';

      const mockSocket = new MockedWebSocket();
      mockSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream({ socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(result.current?.subscribeTo(validIsin, vi.fn())).toBeDefined();
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));

      const waitStockForData = async (isin: string) => {
        return new Promise((resolve, reject) => {
          result.current?.subscribeTo(isin, (data) => {
            resolve(data);
          })
          setTimeout(() => reject(new TimeoutTestError()), 1000);
        });
      }

      const dataAsStr = `{"isin":"IN8212A01012","price":230.1212163887097,"bid":230.11121638870972,"ask":230.1312163887097}`
      // Simulate parallel async operations
      const [watchedStockData,] = await Promise.all([
        waitStockForData("IN8212A01012"), 
        act(() => mockSocket.triggerOnMessageEvent(dataAsStr))
      ]) as [StockData | undefined, undefined];
      expect(watchedStockData?.isin).toBe(validIsin);

      try {
        await Promise.all([
          waitStockForData("US0378331005"), 
          act(() => mockSocket.triggerOnMessageEvent(dataAsStr))
        ])

        assert(false, "Should not react to other ISINs");
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutTestError);
      }
    });
  });

  it('allows you to check the connection status', () => {
    const mockSocket = new MockedWebSocket();
    const { result } = renderHook(() => useStockLiveStream({ socket: mockSocket as unknown as WebSocket }));

    expect(result.current?.connectionState).toBe('disconnected');

    act(() => mockSocket.triggerOnOpenEvent());
    expect(result.current?.connectionState).toBe('connected');

    act(() => mockSocket.triggerOnErrorEvent());
    expect(result.current?.connectionState).toBe('connecting');

    act(() => mockSocket.triggerOnCloseEvent());
    expect(result.current?.connectionState).toBe('disconnected');
  });

  it.each([
    { isin: '' },
    { isin: 'foo' },
    { isin: 'US037833100' },
    { isin: 'US03783310055' },
  ])('thows an error if ISIN is invalid: $isin', ({ isin }) => {
    const mockSocket = new MockedWebSocket();
    const { result } = renderHook(() => useStockLiveStream({ socket: mockSocket as unknown as WebSocket }));

    expect(() => result.current.subscribeTo(isin, vi.fn())).toThrow();
  });
});
