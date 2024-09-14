import { FC } from "react";

import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext
} from "@/components/ui/pagination";

interface INextItemsProps {
  table: {
    page: number
    totalPages: number
  },
  setPagePlus: (amount: number) => void
};

export const NextItems: FC<INextItemsProps> = ({
  table,
  setPagePlus
}) => {
  const isShow = table.page !== table.totalPages - 1;

  if (!isShow) {
    return null;
  }

  return (
    <>
      <PaginationItem onClick={() => setPagePlus(1)}>
        <PaginationLink href="#">{table.page + 1}</PaginationLink>
      </PaginationItem>
      {table.page !== table.totalPages - 2 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}
      <PaginationItem>
        <PaginationNext href="#" onClick={() => setPagePlus(1)} />
      </PaginationItem>
    </>
  )
}
