import { FC } from "react";

import {
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";

interface IActualItemProps {
  table: {
    totalItems: number
    size: number
    page: number
  }
};

export const ActualItem: FC<IActualItemProps> = ({
  table
}) => {
  const isShow = table.totalItems > table.size
  if (!isShow) {
    return null
  }
  return (
    <PaginationItem className="w-[50px]">
      <PaginationLink href="#" isActive>
        {table.page}
      </PaginationLink>
    </PaginationItem>
  );
}
