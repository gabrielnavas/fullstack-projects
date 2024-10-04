import { Header } from "@/components/header/header";
import { MenuAside } from "@/components/menu-aside/menu-aside";
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
        <div className="flex">
          <MenuAside />
          {children}
        </div>
      </TransactionContextProvider>
    </main>
  );
}
