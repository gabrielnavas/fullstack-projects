import { FC, useContext, useEffect } from "react";

import { formatCurrency } from "@/lib/strings";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Pagination = {
  page: number
  size: number
}

export const TransactionList: FC = () => {
  const {
    handleFindTransactions,
    transactions,
    allCategories,
    nextPage,
    previousPage,
    setCurrentPage,
    transactionPageSizeOptions,
    setTransactionPageSize,
  } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions({
      page: transactions.currentPage,
      pageSize: transactions.pageSize
    })
  }, [handleFindTransactions, transactions.currentPage, transactions.pageSize])

  return (
    <>
      <ScrollArea className="h-[550px] w-full border-[1.5px]">
        <Table className="">
          <TableCaption>
            <span className="text-slate-800">
              {transactions.data.length === 0 && 'Nenhuma transação encontrada.'}
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
            {transactions.data.map((transaction) => {
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

      <div className="flex p-4">
        <div className="w-[70%]">
          <Pagination>
            <PaginationContent>

              {/* previous button */}
              {transactions.currentPage >= 1 && (
                <PaginationItem>
                  <Button variant='secondary' onClick={() => previousPage()}>
                    <ArrowLeft className="me-2" />
                    Anterior
                  </Button>
                </PaginationItem>
              )}

              {/* paginate between */}
              {transactions.totalPages > 1 && new Array(transactions.totalPages).fill('').map((_, pageNumber) => {
                if (pageNumber === transactions.currentPage) {
                  return (
                    <PaginationItem key={pageNumber} onClick={
                      () => setCurrentPage(pageNumber)
                    }>
                      <PaginationLink href="#" isActive>
                        {transactions.currentPage}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else {
                  return (
                    <PaginationItem key={pageNumber} onClick={
                      () => setCurrentPage(pageNumber)
                    }>
                      <PaginationLink href="#">
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
              })
              }

              {/* next button */}
              {
                transactions.currentPage < transactions.totalPages - 1 && (
                  <PaginationItem>
                    <Button variant='secondary' onClick={() => nextPage()}>
                      Próxima
                      <ArrowRight className="ms-2" />
                    </Button>

                  </PaginationItem>
                )
              }
            </PaginationContent>
          </Pagination>
        </div>
        <div className="w-[30%]">
          <Select
            defaultValue={transactions.pageSize.toString()}
            onValueChange={v => setTransactionPageSize(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {transactionPageSizeOptions.map(option => (
                  <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
