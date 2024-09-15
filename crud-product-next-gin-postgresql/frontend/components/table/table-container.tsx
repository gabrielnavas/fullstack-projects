import { FC } from "react";

import { Table } from "@/components/ui/table";

interface ITableContainerProps {
  children: React.ReactNode
};

export const TableContainer: FC<ITableContainerProps> = ({
  children
}) => {
  return (
    <Table className="p-3">
      {children}
    </Table>
  );
}
