'use client'

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";

interface Props {
  children: ReactNode
}

export const TYPE_COUNT_NEW_POSTS = "COUNT_NEW_POSTS"

export type Message = {
  id: string
  type: typeof TYPE_COUNT_NEW_POSTS
  data: unknown
}

type Body = {
  type: typeof TYPE_COUNT_NEW_POSTS
  token: string,
  body: unknown
}

export type WebSocketContextType = {
  messages: Message[]
  sendMessage: (body: Body) => void
  removeMessage: (message: Message) => void
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const WebSocketContextProvider: FC<Props> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');
    setWs(socket);

    socket.onopen = () => {
      console.log('Conectado ao WebSocket');
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Mensagem recebida:", response);
      setMessages((prevMessages) => [...prevMessages, response]);
    };

    return () => {
      socket.close();
    };
  }, [])

  const sendMessage = useCallback((body: Body) => {
    if (!ws) {
      return
    }
    ws.send(JSON.stringify(body));
  }, [ws])

  const removeMessage  = useCallback((message: Message) => {
    const newMessages = messages.filter(m => m.id !== message.id)
    setMessages(newMessages)
  }, [messages])


  return (
    <WebSocketContext.Provider value={{
      messages, sendMessage, removeMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}
