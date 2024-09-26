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
import { TypeTransaction } from "@/services/models";
import { formatCurrency } from "@/utils/strings";
import { FC, useCallback, useContext, useEffect } from "react";

export const TransactionList: FC = () => {
  const { handleFindTransactions, typeTransactionNames,
     typeTransactions, transactions, 
     allCategories } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions()
  }, [handleFindTransactions])

  console.log(allCategories)

  const getCategoryName = (id: string) => {
    const category = allCategories.find(category => category.id === id)
    if (category !== undefined) {
      return category.name
    }
    return ''
  }

  const getTypeTransactionName = useCallback(
    (typeTransactionId: string): string => {
      if(typeTransactions.length  === 0) {
        return ''
      }
      const typeTransactionsSelected: TypeTransaction[] = typeTransactions.filter(typeTransaction => typeTransaction.id === typeTransactionId)
      if (typeTransactionsSelected.length === 0) {
        return ''
      }
      const typeTransaction: TypeTransaction = typeTransactionsSelected[0]
      const names = typeTransactionNames.filter(
        typeTransactionName => typeTransactionName.name === typeTransaction.name
      )
      if (names.length > 0) {
        return names[0].displayName
      }
      return 'name'
    }, [typeTransactionNames, typeTransactions])

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
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{formatCurrency(String(transaction.amount), 'pt-BR')}</TableCell>
            <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
            <TableCell>{getTypeTransactionName(transaction.typeTransactionId)}</TableCell>
            <TableCell className="text-right">{transaction.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
