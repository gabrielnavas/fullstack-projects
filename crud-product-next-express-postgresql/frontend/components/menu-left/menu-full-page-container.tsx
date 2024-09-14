import { FC } from "react";

interface IMenuFullPageContainerProps {
  children: React.ReactNode
};

export const MenuFullPageContainer: FC<IMenuFullPageContainerProps> = ({
  children
}) => {
  return (
    <ul className="
      gap-2 
      hidden
      p-1 
      pt-2 
      border-r-2 
      shadow-md
      lg:w-[250px] 
      lg:flex 
      lg:flex-col 
    ">
      {children}
    </ul>
  );
}
