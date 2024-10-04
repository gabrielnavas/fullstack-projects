import { Header } from "@/components/header/header";
import { MenuAside } from "@/components/menu-aside/menu-aside";
import { Card } from "@/components/ui/card";
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
      <div className="flex">
        <MenuAside />
        <Card className="w-full m-4 p-4 ms-1">
          {children}
        </Card>
      </div>
    </main>
  );
}
