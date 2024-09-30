'use client'

import { FC } from "react";

import { TransactionsFormDialog } from "@/components/transactions/form/transaction-form";
import { TransactionSearchForm } from "./transaction-search-form-header";

export const TransactionHeader: FC = () => {

  return (
    <div className="flex flex-col gap-4 mb-2">
      <div className="flex justify-start">
        <TransactionsFormDialog />
      </div>
      <TransactionSearchForm />
    </div >
  );
}
