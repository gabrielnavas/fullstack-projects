import { FC, useContext, useEffect } from "react";

import { formatCurrency } from "@/utils/strings";

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

export const TransactionList: FC = () => {
  const { 
    handleFindTransactions, 
    transactions,
    allCategories ,
  } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions()
  }, [handleFindTransactions])


  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Valor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Tipo de transação</TableHead>
          <TableHead className="text-right">Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          return (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{formatCurrency(String(transaction.amount), 'pt-BR')}</TableCell>
              <TableCell>{getCategoryNameById(transaction.categoryId, allCategories)}</TableCell>
              <TableCell>
               {transaction.typeTransaction.displayName}
              </TableCell>
              <TableCell className="text-right">{transaction.description}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
