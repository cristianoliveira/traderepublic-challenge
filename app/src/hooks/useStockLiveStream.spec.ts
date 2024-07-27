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
