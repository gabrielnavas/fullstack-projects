'use client'

import { Button } from "@/components/ui/button";
import { AuthContext, AuthContextType } from "./contexts/auth-context";
import { useContext, useLayoutEffect } from "react";

export default function Home() {
  const { handleLogout, isNotAuthCheck, user } = useContext(AuthContext) as AuthContextType

  useLayoutEffect(() => isNotAuthCheck(), [isNotAuthCheck])

  return (
    <div>
      <div className="flex justify-between h-[100px] bg-black">
        <div className="flex items-center p-4">
          <span className="text-white text-semibold text-2xl">
            SocialNetwork
          </span>
        </div>
        <div className="flex items-center p-4 gap-4">
          <span className="text-white">Hello {user?.username}</span>
          <Button variant='outline' className="text-white hover:text-black" onClick={() => handleLogout()}>
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
