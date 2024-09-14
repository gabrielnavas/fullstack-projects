import { FC } from "react";

import { TableHead } from "@/components/ui/table";

interface ITableHeaderEndProps {
  children: React.ReactNode
};

export const TableHeaderEnd: FC<ITableHeaderEndProps> = ({
  children
}) => {
  return (
    <TableHead className="text-right">
      {children}
    </TableHead>
  );
}
