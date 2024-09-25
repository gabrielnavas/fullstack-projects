import { Header } from "@/components/header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finances App | Dashboard",
  description: "Finances for you!",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
