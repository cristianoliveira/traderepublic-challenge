import { useState } from "preact/hooks";
import { validateISIN } from "../modules/isin";

let socketSingleton: WebSocket | null = null;
export const getConnection = () => {
  console.log('@@@@@@ socketSingleton: ', socketSingleton);
  socketSingleton = socketSingleton || new WebSocket("ws://localhost:8425");
  return socketSingleton;
}

type StockLiveStream = {
  connectionState: 'connected' | 'disconnected' | 'errored';
}

type StockLiveStreamHook = (isin: string, ctx?: { socket: WebSocket }) => StockLiveStream;

export const useStockLiveStream: StockLiveStreamHook = (isin, ctx = { socket: getConnection() }) => {
  if (!validateISIN(isin)) {
    throw new Error(`Invalid ISIN code: ${isin}`);
  }

  const [connectionState, setConnectionState] = useState<StockLiveStream["connectionState"]>('disconnected');
  console.log('@@@@@@ watching isin: ', isin);
  const { socket } = ctx;
  console.log('@@@@@@ socket: ', socket);

  // Event handlers
  socket.onopen = function(event) {
    console.log("Connected to WebSocket server.");
    console.log('@@@@@@ event: ', event);
    setConnectionState('connected');
  };

  socket.onmessage = function(event) {
    console.log("Message from server: ", event.data);
  };

  socket.onerror = function(event) {
    console.log("WebSocket error: ", event);
    setConnectionState('errored');
  };

  socket.onclose = function(event) {
    console.log("WebSocket connection closed: ", event);
    setConnectionState('disconnected');
  };

  // To send a message to the server
  // socket.send(JSON.stringify({"subscribe":"IN8212A01012"}));

  return {
    connectionState
  }
}
