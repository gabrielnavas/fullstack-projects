import { FC, useContext, useLayoutEffect } from "react";

import { AuthContext, AuthContextType } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";

export const Header: FC = () => {
  const { handleLogout, isNotAuthCheck, user } = useContext(AuthContext) as AuthContextType

  useLayoutEffect(() => isNotAuthCheck(), [isNotAuthCheck])

  const socialNetworkName = process.env.NEXT_PUBLIC_SOCIALNETOWORK_NAME

  return (
    <div className="flex justify-between h-[100px] bg-black">
      <div className="flex items-center p-4">
        <span className="text-white text-semibold text-2xl">
          {socialNetworkName ? socialNetworkName : 'SocialNetwork'}
        </span>
      </div>
      <div className="flex items-center p-4 gap-4">
        <span className="text-white">Hello @{user?.username}</span>
        <Button variant='outline' className="text-white hover:text-black" onClick={() => handleLogout()}>
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
