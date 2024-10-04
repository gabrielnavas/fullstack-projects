import {
  FC,
  useCallback,
  useContext
} from "react";

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Menu } from "lucide-react";
import { DialogRemoveButton } from "./transaction-remove-button";
import { TransactionContext, TransactionContextType } from "@/context/transaction-context";
import { TransactionsFormDialog } from "../form/transaction-form";
import { Transaction } from "@/services/models";

type Props = {
  transaction: Transaction
}

export const TransactionListOptions: FC<Props> = ({
  transaction,
}) => {
  const {
    handleRemoveTransaction
  } = useContext(TransactionContext) as TransactionContextType

  const onClickRemoveTransaction = useCallback(async (): Promise<boolean> => {
    try {
      return await handleRemoveTransaction(transaction.id)
    }
    catch {
      return false
    }
  }, [transaction, handleRemoveTransaction])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <TransactionsFormDialog transaction={transaction} />
          <DialogRemoveButton confirm={onClickRemoveTransaction} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
