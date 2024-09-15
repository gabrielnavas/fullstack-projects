import { FC } from "react";
interface ITopSideContainerProps {
  children: React.ReactNode,
};

export const TopSideContainer: FC<ITopSideContainerProps> = ({
  children
}) => {
  return (
    <div className="flex md:flex-row flex-col gap-2 pt-4 pb-4 me-4">
      {children}
    </div>
  );
}
