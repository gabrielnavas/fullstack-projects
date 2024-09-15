import { FC } from "react";

import { TableHead } from "@/components/ui/table";

interface ITableHeadProps {
  children: React.ReactNode
};

export const TableHeadStart: FC<ITableHeadProps> = ({
  children
}) => {
  return (
    <TableHead className="md:w-[100px] w-[20px]">
      {children}
    </TableHead>
  );
}
