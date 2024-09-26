'use client'

import { AuthContext, AuthContextType } from "@/context/auth-context";
import { findTransactions } from "@/services/find-transactions";
import { Transaction } from "@/services/models";
import { FC, useContext, useEffect, useState } from "react";


const TransactionsPage: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const {token} = useContext(AuthContext) as AuthContextType

  useEffect(() => {
    (async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }
      const result = await findTransactions(token)()
      setTransactions(result.data!)
    })()
  }, [token])

  return (
   <div>{transactions && transactions.map(transaction => (
    <div key={transaction.id}>{transaction.description}</div>
   ))}</div>
  )
}

export default TransactionsPage