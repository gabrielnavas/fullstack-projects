import { FC } from "react";

import { 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface IPreviousItemsProps {
  table: {
    page: number
  }
  setPageMinus: (many: number) => void
};

export const PreviousItems: FC<IPreviousItemsProps> = ({
  table,
  setPageMinus
}) => {
  const isShow = table.page > 0;
  if (!isShow) {
    return null
  }
  return (
    <>
      <PaginationItem onClick={() => setPageMinus(1)}>
        <PaginationPrevious href="#" />
      </PaginationItem>
      {table.page > 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}
      <PaginationItem onClick={() => setPageMinus(1)}>
        <PaginationLink href="#">{table.page - 1}</PaginationLink>
      </PaginationItem>
    </>
  );
}
