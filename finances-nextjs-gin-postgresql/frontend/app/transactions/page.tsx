'use client'

import { FC } from "react";

import { TransactionFormContainer } from "@/components/transactions/form/transaction-form-container";
import { TransactionList } from "@/components/transactions/list/transaction-list";
import { TransactionHeader } from "@/components/transactions/header/transaction-header";


const TransactionsPage: FC = () => {
  return (
    <TransactionFormContainer>
      <div className="flex flex-col">
        <TransactionHeader />
        <TransactionList />
      </div>
    </TransactionFormContainer>
  )
}

export default TransactionsPage