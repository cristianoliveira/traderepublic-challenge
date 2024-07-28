import { Page } from "@playwright/test";

export const prepareWebSocketSpy = (page: Page) => {
  let resolver: any = null;
  const assertWebSocket = (expectedISIN: string) => {
    return new Promise((res, rej) => {
      const timeoutInstance = setInterval(() => {
        if (rej) rej(new Error(`The assertWebSocket timed out waiting for ${expectedISIN}`));
      }, 20000);

      resolver = (evt: any) => {
        if (evt.isin === expectedISIN) {
          clearInterval(timeoutInstance);
          console.debug("resolving for", expectedISIN);
          res(true);
        }
      };

    });
  }

  page.on('websocket', (ws) => {
    ws.on("framereceived", (event) => {
      if (resolver) resolver(JSON.parse(event.payload as string));
    });
  });

  return assertWebSocket;
}
