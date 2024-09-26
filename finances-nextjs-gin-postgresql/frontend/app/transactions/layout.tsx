import { Header } from "@/components/header/header";
import { TransactionContextProvider } from "@/context/transaction-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finances App | Nova Transação",
  description: "Finances for you!",
};

export default function TransactionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <TransactionContextProvider>
        {children}
      </TransactionContextProvider>
    </main>
  );
}
