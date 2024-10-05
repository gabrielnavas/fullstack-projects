'use client'

import { FC, useContext } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AuthContext, AuthContextType } from "@/context/auth-context";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export const Header: FC = () => {
  const {
    isAuthenticated,
    handleSignOut,
  } = useContext(AuthContext) as AuthContextType

  return (
    <Card className="flex justify-between m-4 mb-2 w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="flex flex-col">
          <CardTitle>EasyFinance</CardTitle>
          <CardDescription>Gerencie suas finanças</CardDescription>
        </div>
      </CardHeader>
      {isAuthenticated() && (
        <CardContent className="flex items-center p-0 pr-6">
          <Button variant='outline' className="font-semibold" onClick={() => handleSignOut()}>
            <LogOut />
            Logout
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
