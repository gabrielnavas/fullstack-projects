import { LoaderCircle } from "lucide-react";
import { FC, ReactNode } from "react";

interface ICRUDContainerProps {
  children: ReactNode,
  isLoading: boolean
};

export const CRUDContainer: FC<ICRUDContainerProps> = ({
  children,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center   w-[100%] h-[80vh]">
        <LoaderCircle className="flex self-center text-slate-700 animate-spin" size={100} />
      </div>
    )
  }
  return (
    <div className="ms-2">
      {children}
    </div>
  );
}
