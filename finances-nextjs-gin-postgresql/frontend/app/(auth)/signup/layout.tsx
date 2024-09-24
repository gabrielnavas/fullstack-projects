import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finances App | Faça sua conta",
  description: "Finances for you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center w-[100%] min-h-[100vh]">
      <Header />
      {children}
    </div>
  );
}
