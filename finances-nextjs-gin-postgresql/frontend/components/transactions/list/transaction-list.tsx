import { FC, useCallback, useContext, useEffect, useState } from "react";

import { formatCurrency } from "@/lib/strings";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TransactionContext,
  TransactionContextType
} from "@/context/transaction-context";
import { getCategoryNameById } from "@/services/find-category";
import { formattedDateAndTime } from "@/lib/date";
import { TransactionListOptions } from "./transaction-list-options";
import { ScrollArea } from "@/components/ui/scroll-area";

type Pagination = {
  page: number
  size: number
}

export const TransactionList: FC = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 5
  })

  const {
    handleFindTransactions,
    transactions,
    allCategories,
  } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions({
      page: pagination.page,
      pageSize: pagination.size
    })
  }, [handleFindTransactions, pagination])

  const previousPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: prev.page - 1,
    }))
  }, [])

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: prev.page + 1,
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page: page,
    }))
  }, [])

  return (
    <>
      <ScrollArea className="h-[550px] w-full">
        <Table>
          <TableCaption>
            <span className="text-slate-800">
              {transactions.length === 0 && 'Nenhuma transação encontrada.'}
            </span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Valor</TableHead>
              <TableHead className="sm:table-cell hidden">Tipo de transação</TableHead>
              <TableHead className="sm:table-cell hidden">Categoria</TableHead>
              <TableHead>Feita em</TableHead>
              <TableHead>Atualizado em</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="sm:table-cell hidden text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{
                    formatCurrency(String(transaction.amount), 'pt-BR')
                  }</TableCell>
                  <TableCell className="sm:table-cell hidden">
                    {transaction.typeTransaction.displayName}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">{
                    getCategoryNameById(transaction.categoryId, allCategories)
                  }</TableCell>
                  <TableCell>
                    {formattedDateAndTime(transaction.createdAt)}
                  </TableCell>
                  <TableCell>
                    {transaction.updatedAt
                      ? formattedDateAndTime(transaction.updatedAt)
                      : <div className="flex justify-center text-slate-700">-</div>}
                  </TableCell>
                  <TableCell className="truncate max-w-[230px]">{transaction.description}</TableCell>
                  <TableCell className="sm:table-cell hidden text-right">
                    <TransactionListOptions transaction={transaction} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => previousPage()} />
          </PaginationItem>
          {
            pagination.page - 1 >= 0 && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => setPage(pagination.page - 1)}>
                  {pagination.page - 1}
                </PaginationLink>
              </PaginationItem>
            )
          }
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {pagination.page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={() => setPage(pagination.page + 1)}>
              {pagination.page + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={() => nextPage()} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </>
  )
}
