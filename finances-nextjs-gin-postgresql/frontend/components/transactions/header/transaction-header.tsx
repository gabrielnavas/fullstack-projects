'use client'

import { FC } from "react";

import { TransactionsFormDialog } from "@/components/transactions/form/transaction-form";
import { TransactionSearchForm } from "./transaction-search-form-header";

export const TransactionHeader: FC = () => {

  return (
    <div className="flex flex-col gap-2 mb-2">
      <TransactionsFormDialog />
      <TransactionSearchForm />
    </div >
  );
}
