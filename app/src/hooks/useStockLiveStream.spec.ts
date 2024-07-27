import { describe, it, expect, vi, type Mock } from 'vitest';
import { act, renderHook } from "@testing-library/preact";
import { useStockLiveStream } from './useStockLiveStream';

class MockedWebSocket implements Partial<WebSocket> {
  addEventListener: Mock;
  send: Mock;
  close: Mock;
  onopen: Mock;
  onmessage: Mock;
  onerror: Mock;
  onclose: Mock;

  readyState: number = WebSocket.CLOSED;

  constructor() {
    this.addEventListener = vi.fn();
    this.send = vi.fn();
    this.close = vi.fn();
    this.onopen = vi.fn();
    this.onmessage = vi.fn();
    this.onerror = vi.fn();
    this.onclose = vi.fn();
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
}

describe('useStockLiveStream', () => {
  describe('watching a valid ISIN', () => {
    it('waits for connection before subscribing', () => {
      const mockSocket = new MockedWebSocket();
      const validIsin = 'US0378331005';

      const { result } = renderHook(() => useStockLiveStream(validIsin, { socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('disconnected');
      expect(mockSocket.send).not.toHaveBeenCalled();

      act(() => mockSocket.triggerOnOpenEvent());
      expect(result.current?.connectionState).toBe('connected');

      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('subscribe when the connection is open', () => {
      const validIsin = 'US0378331005';

      const mockSocket = new MockedWebSocket();
      mockSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream(validIsin, { socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));
    });

    it('returns da live data on stock change', () => {
      const validIsin = 'US0378331005';

      const mockSocket = new MockedWebSocket();
      mockSocket.readyState = WebSocket.OPEN;

      const { result } = renderHook(() => useStockLiveStream(validIsin, { socket: mockSocket as unknown as WebSocket }));

      expect(result.current?.connectionState).toBe('connected');
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ subscribe: validIsin }));

      const dataAsStr = `{"isin":"IN8212A01012","price":230.1212163887097,"bid":230.11121638870972,"ask":230.1312163887097}`
      act(() => mockSocket.onmessage({ data: dataAsStr }));

      expect(result.current?.lastStockState).toBeDefined();
    });
  });

  it('allows you to check the connection status', () => {
    const mockSocket = new MockedWebSocket();
    const validIsin = 'US0378331005';
    const { result } = renderHook(() => useStockLiveStream(validIsin, { socket: mockSocket as unknown as WebSocket }));

    expect(result.current?.connectionState).toBe('disconnected');

    act(() => mockSocket.triggerOnOpenEvent());
    expect(result.current?.connectionState).toBe('connected');

    act(() => mockSocket.triggerOnErrorEvent());
    expect(result.current?.connectionState).toBe('errored');

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
    expect(() => renderHook(() => useStockLiveStream(isin, { socket: mockSocket as unknown as WebSocket }))).toThrow();
  });
});
