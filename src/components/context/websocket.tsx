import { createContext, useContext } from "react";
import { type SendJsonMessage } from "react-use-websocket/dist/lib/types";

interface WebsocketClientContextType {
  sendJsonMessage: SendJsonMessage;
  websocketUrl: string;
}

const WebsocketClientContext = createContext<WebsocketClientContextType>(
  {} as WebsocketClientContextType
);

export const useWebsocketClient = () => useContext(WebsocketClientContext);

export const WebsocketClientProvider = WebsocketClientContext.Provider;
