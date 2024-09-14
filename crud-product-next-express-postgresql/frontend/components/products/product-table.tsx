"use client"

import { useContext } from "react";

import { CRUDContainer } from "@/components/crud-container";

import { TableBody } from "@/components/ui/table"

import { Pagination } from "@/components/table/pagination/pagination";
import { SizeOptionsSelect } from "@/components/table/pagination/size-options-select";
import { ButtonSearch } from "@/components/table/top-side/button-search";
import { InputSearch } from "@/components/table/top-side/input-search";
import { TopSideContainer } from "@/components/table/top-side/top-side-container";
import { ScrollAreaBody } from "@/components/table/body/scroll-area-body";
import { BodyMessage } from "@/components/table/body/body-message";
import { TableContainer } from "@/components/table/table-container";

import { TableContext } from "@/components/products/context/product-context";
import { CreateProductButtonDialog } from "@/components/products/create-product-dialog";
import { TableContextType } from "@/components/products/context/types";
import { ProductTableRows } from "@/components/products/product-table-rows";
import { ProductTableHeader } from "@/components/products/product-table-header";

export const ProductTable = () => {

  const {
    table,
    handleSetPageMinus,
    handleSetPagePlus,
    handleSetSize,
    sizeOptions,
    refresh,
    handleUpdateInputSearch,
  } = useContext(TableContext) as TableContextType

  return (
    <CRUDContainer isLoading={table.isLoading}>
      <TopSideContainer>
        <div className="flex w-[100%] md:justify-center">
          <InputSearch
            onChange={value => handleUpdateInputSearch(value)}
            onSubmitEnter={refresh}
            placeholder="Type to search products. By Name or Description"
            query={table.query}
          />
          <ButtonSearch
            submit={refresh}
            helpMessage="Click here to search a product by Name or Description" />
        </div>
        <CreateProductButtonDialog />
      </TopSideContainer>
      <ScrollAreaBody>
        <TableContainer>
          <BodyMessage isShow={table.isEmpty} message="Products not found." />
          <ProductTableHeader />
          <TableBody>
            <ProductTableRows />
          </TableBody>
        </TableContainer>
      </ScrollAreaBody>
      <div className=" h-[100%] flex align-middle justify-end">
        <Pagination
          setPageMinus={handleSetPageMinus}
          setPagePlus={handleSetPagePlus}
          table={{
            page: table.page,
            size: table.size,
            totalItems: table.totalItems,
            totalPages: table.totalPages
          }}
        />
        <SizeOptionsSelect
          sizesOptions={sizeOptions}
          totalItems={table.totalItems}
          size={table.size}
          setSize={size => handleSetSize(size)}
        />
      </div>
    </CRUDContainer>
  );
}

