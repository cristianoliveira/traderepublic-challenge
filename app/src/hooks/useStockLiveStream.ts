import { useEffect, useRef, useState } from "preact/hooks";
import { validateISIN } from "../modules/isin";

let socketSingleton: WebSocket | null = null;
export const getConnection = () => {
  socketSingleton = socketSingleton || new WebSocket("ws://localhost:8425");
  return socketSingleton;
}

export type StockData = {
  isin: string;
  price: number;
  bid: number;
  ask: number;
}

export type StockLiveStream = {
  connectionState: 'init' | 'connected' | 'disconnected' | 'errored' | 'connecting';
  subscribeTo: (isin: string, callback: (data: StockData) => void) => void;
}

type StockLiveStreamHookCtx = { socket: WebSocket };
type StockLiveStreamHook = (ctx?: StockLiveStreamHookCtx) => StockLiveStream;

/**
 * Hook to connect to a live stream of a stock
 *
 * @param ctx StockLiveStreamHookCtx
 *
 * @returns StockLiveStream
 **/
export const useStockLiveStream: StockLiveStreamHook = (ctx = { socket: getConnection() }) => {
  const socketRef = useRef(ctx.socket);
  const socket = socketRef.current;

  const [connectionState, setConnectionState] = useState<StockLiveStream["connectionState"]>('init');

  useEffect(() => {
    socket.onopen = () => {
      setConnectionState('connected');
    };

    socket.onerror = (event) => {
      console.error("WebSocket connection error: ", event);
      setConnectionState('errored');
    };

    socket.onclose = () => {
      setConnectionState('disconnected');
    };
  }, []);

  useEffect(() => {
    if (connectionState === 'errored') {
      socketRef.current = getConnection();
      setConnectionState('connecting');
    }

    if (connectionState === 'init') {
      const connectionInitState = socket.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
      setConnectionState(connectionInitState);
    }
  }, [connectionState]);

  return {
    connectionState,

    subscribeTo: (isin: string, callback: (data: StockData) => void) => {
      if (connectionState !== 'connected') {
        socketRef.current = getConnection();
        setConnectionState('connecting');
      }

      if (!validateISIN(isin)) {
        throw new Error(`Invalid ISIN code: ${isin}`);
      }

      socket.send(JSON.stringify({ subscribe: isin }));

      const handler = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as StockData;
        if (data.isin !== isin) {
          return;
        }

        callback(data);
      };

      socket.addEventListener('message', handler);

      return () => {
        socket.removeEventListener('message', handler);
      }
    }
  }
}
