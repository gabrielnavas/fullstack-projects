'use client'

import { FC, useContext, useEffect } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AuthContext, AuthContextType } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export const Header: FC = () => {
  const {
    isAuthenticated
  } = useContext(AuthContext) as AuthContextType

  const route = useRouter()

  useEffect(() => {
    if(!isAuthenticated()) {
      route.replace("/signin")
    }
  }, [isAuthenticated, route])

    return (
      <Card className="w-[100%]">
        <CardHeader>
          <CardTitle>EasyFinance</CardTitle>
          <CardDescription>Gerencie suas finanças</CardDescription>
        </CardHeader>
      </Card>
    );
}
