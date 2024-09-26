import type { Metadata } from "next"

import { Header } from "@/components/header/header"

export const metadata: Metadata = {
  title: "Finances App | Nova Transação",
  description: "Finances for you!",
}

export default function TransactionListLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <Header />
      {children}
    </main>
  )
}
