'use client'

import React from "react";

interface Props {
  children: React.ReactNode
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

export const WebSocketContext = React.createContext<WebSocketContextType | null>(null)

export const WebSocketContextProvider: React.FC<Props> = ({ children }) => {
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT
    if(url === undefined) {
      throw new Error('call the admin! missing url to connect a websocket')
    }
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => {
      console.log('conected to WebSocket');
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, response]);
    };

    return () => {
      socket.close();
    };
  }, [])

  const sendMessage = React.useCallback((body: Body) => {
    if (!ws) {
      return
    }
    ws.send(JSON.stringify(body));
  }, [ws])

  const removeMessage  = React.useCallback((message: Message) => {
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
