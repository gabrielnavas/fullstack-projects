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
import { TransactionContext, TransactionContextType } from "@/context/transaction-context";
import { getCategoryNameById } from "@/services/find-category";
import { formattedDateAndTime } from "@/lib/date";

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
      <TableCaption>Todas suas transações até agora.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Valor</TableHead>
          <TableHead className="sm:table-cell hidden">Categoria</TableHead>
          <TableHead className="sm:table-cell hidden">Tipo de transação</TableHead>
          <TableHead>Feita em</TableHead>
          <TableHead className="sm:table-cell hidden text-right">Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          return (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{formatCurrency(String(transaction.amount), 'pt-BR')}</TableCell>
              <TableCell className="sm:table-cell hidden">{getCategoryNameById(transaction.categoryId, allCategories)}</TableCell>
              <TableCell className="sm:table-cell hidden">
                {transaction.typeTransaction.displayName}
              </TableCell>
              <TableCell>
                {formattedDateAndTime(transaction.createdAt)}
              </TableCell>
              <TableCell className="sm:table-cell hidden text-right">{transaction.description}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
