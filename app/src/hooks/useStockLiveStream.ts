import { useEffect, useRef, useState } from "preact/hooks";
import { validateISIN } from "../modules/isin";

let socketSingleton: WebSocket | null = null;
export const getConnection = () => {
  console.log('@@@@@@ socketSingleton: ', socketSingleton);
  // eslint-disable-next-line 
  // debugger;
  socketSingleton = socketSingleton || new WebSocket("ws://localhost:8425");
  return socketSingleton;
}

type StockData = {
  isin: string;
  price: number;
  bid: number;
  ask: number;
}

type StockLiveStream = {
  connectionState: 'connected' | 'disconnected' | 'errored';
  lastStockState: StockData | undefined;
}

type StockLiveStreamHookCtx = { socket: WebSocket };
type StockLiveStreamHook = (isin: string, ctx?: StockLiveStreamHookCtx) => StockLiveStream;

/**
 * Hook to connect to a live stream of a stock
 *
 * @param isin ISIN code
 * @param ctx StockLiveStreamHookCtx
 *
 * @returns StockLiveStream
 *
 * @throws Error if ISIN is invalid
 **/
export const useStockLiveStream: StockLiveStreamHook = (isin, ctx = { socket: getConnection() }) => {
  if (!validateISIN(isin)) {
    throw new Error(`Invalid ISIN code: ${isin}`);
  }

  const socketRef = useRef(ctx.socket);
  const socket = socketRef.current;

  const connectionInitState = socket.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
  const [connectionState, setConnectionState] = useState<StockLiveStream["connectionState"]>(connectionInitState);
  const [lastStockState, setLastStockState] = useState<StockData | undefined>();
  console.log('@@@@@@ watching isin: ', isin);
  console.log('@@@@@@ socket: ', socket);
  // eslint-disable-next-line 
  // debugger;

  useEffect(() => {
    // Event handlers
    socket.onopen = function(event) {
      console.log("Connected to WebSocket server.");
      console.log('@@@@@@ event: ', event);
      setConnectionState('connected');
      socket.send(JSON.stringify({ subscribe: isin }));
    };

    socket.onerror = function(event) {
      console.log("WebSocket error: ", event);
      setConnectionState('errored');
    };

    socket.onclose = function(event) {
      console.log("WebSocket connection closed: ", event);
      setConnectionState('disconnected');
    };
  }, []);

  useEffect(() => {
    if (connectionState === 'connected') {
      socket.send(JSON.stringify({ subscribe: isin }));

      socket.onmessage = function(event) {
        console.log("Message from server: ", event.data);
        setLastStockState(JSON.parse(event.data));
      };
    }
  }, [connectionState]);

  return {
    connectionState,
    lastStockState,
  }
}
