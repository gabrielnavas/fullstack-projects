'use client'

import { FC } from "react";

import { TransactionsFormDialog } from "@/components/transactions/form/transaction-form";
import { TransactionSearchForm } from "./transaction-search-form-header";

export const TransactionHeader: FC = () => {

  return (
    <div className="flex sm:flex-row flex-col justify-between gap-2 sm:gap-0">
      <div className="flex justify-start">
        <TransactionsFormDialog />
      </div>
      <TransactionSearchForm />
    </div >
  );
}
