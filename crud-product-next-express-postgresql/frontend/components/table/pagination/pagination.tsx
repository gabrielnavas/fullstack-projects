import { FC } from "react";

import { 
  Pagination as PaginationChadUi, 
  PaginationContent 
} from "@/components/ui/pagination";
import { PreviousItems } from "@/components/table/pagination/previous-items";
import { ActualItem } from "@/components/table/pagination/actual-item";
import { NextItems } from "@/components/table/pagination/next-items";

interface IPaginationProps {
  table: {
    page: number
    size: number
    totalItems: number
    totalPages: number
  },
  setPageMinus: (many: number) => void,
  setPagePlus: (many: number) => void,
};

export const Pagination: FC<IPaginationProps> = ({
  table,
  setPageMinus,
  setPagePlus
}) => {
  const tableIsEmpty = table.totalItems === 0
  if(tableIsEmpty) {
    return null;
  }
  return (
    <PaginationChadUi className=" h-[100%]">
      <PaginationContent>
        <PreviousItems
          table={{
            page: table.page
          }}
          setPageMinus={setPageMinus}
        />
        <ActualItem
          table={{
            page: table.page,
            size: table.size,
            totalItems: table.totalItems
          }}
        />
        <NextItems
          table={{
            page: table.page,
            totalPages: table.totalPages
          }}
          setPagePlus={setPagePlus}
        />
        {/* {table.page !== table.totalPages - 1 && nextItems} */}
      </PaginationContent>
    </PaginationChadUi>
  );
}
