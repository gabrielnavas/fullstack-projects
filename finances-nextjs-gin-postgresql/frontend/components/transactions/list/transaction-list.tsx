import { FC, useContext, useEffect } from "react";

import { formatCurrency } from "@/lib/strings";

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

export const TransactionList: FC = () => {
  const {
    handleFindTransactions,
    transactions,
    allCategories,
  } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions({})
  }, [handleFindTransactions])

  return (
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
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="sm:table-cell hidden text-right">
                <TransactionListOptions transaction={transaction} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
