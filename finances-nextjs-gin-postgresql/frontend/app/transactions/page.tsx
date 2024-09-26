'use client'

import { FC } from "react";

import TransactionsForm from "@/components/transactions/form/transaction-form";
import { TransactionFormContainer } from "@/components/transactions/form/transaction-form-container";
import { TransactionList } from "@/components/transactions/list/transaction-list";

const TransactionsPage: FC = () => {
  return (
    <TransactionFormContainer>
      <TransactionsForm />
      <TransactionList />
    </TransactionFormContainer>
  )
}

export default TransactionsPage