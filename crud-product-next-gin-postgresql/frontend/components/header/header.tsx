import { FC } from "react";

import { MenuMobile } from "@/components/menu-left/menu-mobile";

interface IHeaderProps {
  organization: {
    name: string
    description: string
  }
};

export const Header: FC<IHeaderProps> = ({
  organization
}) => {
  return (
    <div className="
      flex 
      items-center 
      justify-start 
      h-full 
      border-b-2 
      border-slate-200 
      bg-slate-100 
      shadow-sm 
      p-4">
      <MenuMobile />
      <div className="flex flex-col ml-5">
        <span className="text-md font-bold tracking-tight text-gray-800">
          {organization.name}
        </span>
        <span className="text-xs tracking-tight text-gray-500">
          {organization.description}
        </span>
      </div>
    </div>
  );
}