'use client'

import { FC } from "react";

import TransactionsForm from "@/components/transactions/form/transaction-form";
import { TransactionFormContainer } from "@/components/transactions/form/transaction-form-container";

const TransactionsPage: FC = () => {
  return (
    <TransactionFormContainer>
      <TransactionsForm />
    </TransactionFormContainer>
  )
}

export default TransactionsPage