import type { Metadata } from "next";

import "./globals.css";

import { AuthContextProvider } from "../contexts/auth-context";

import { Toaster } from "@/components/ui/toaster";
import { WebSocketContextProvider } from "@/contexts/web-socket-context";

export const metadata: Metadata = {
  title: "Feed Posts",
  description: "A basic Feed Posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <WebSocketContextProvider>
            {children}
          </WebSocketContextProvider>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
