import { TransactionContext, TransactionContextType } from "@/context/transaction-context";
import { FC, useContext, useEffect } from "react";

export const TransactionList: FC = () => {
  const { handleFindTransactions, transactions } = useContext(TransactionContext) as TransactionContextType

  useEffect(() => {
    handleFindTransactions()
  }, [handleFindTransactions])

  return (
    <div>{transactions && transactions.map(transaction => (
      <div key={transaction.id}>{transaction.description}</div>
    ))}</div>
  )
}
