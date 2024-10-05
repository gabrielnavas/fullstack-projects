'use client'

import { FC, useContext, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AuthContext, AuthContextType } from "@/context/auth-context";
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { MenuCenter } from "../menu-aside/menu-center";

export const Header: FC = () => {
  const {
    isAuthenticated,
    handleSignOut,
  } = useContext(AuthContext) as AuthContextType

  const [openMenuCenter, setOpenMenuCenter] = useState<boolean>(false)

  return (
    <>
      <Card className="flex justify-between m-4">
        <CardHeader className="flex flex-row items-center gap-4">

          <div className="lg:hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' onClick={() => setOpenMenuCenter(true)}>
                    <Menu />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm text-muted-foreground">
                    Press{" "}
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">Ctrl/Meta m</span>
                    </kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col">
            <CardTitle>EasyFinance</CardTitle>
            <CardDescription>Gerencie suas finanças</CardDescription>
          </div>
        </CardHeader>
        {isAuthenticated() && (
          <CardContent className="flex items-center p-0 pr-6">
            <Button
              variant='outline'
              className="font-semibold"
              onClick={() => handleSignOut()}>
              <LogOut />
              Logout
            </Button>
          </CardContent>
        )}
      </Card>

      <MenuCenter isOpen={openMenuCenter} onChangeOpen={setOpenMenuCenter} />
    </>
  );
}
