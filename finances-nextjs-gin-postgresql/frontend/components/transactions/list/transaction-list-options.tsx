import {
  FC,
  useCallback,
  useContext,
  useState
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
  const [popoverOpen, setPopoverOpen] = useState(false)

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

  const handleTogglePopover = useCallback(() => {
    setPopoverOpen(prev => !prev)
  }, [])

  return (
    <Popover open={popoverOpen} onOpenChange={open => setPopoverOpen(open)}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <TransactionsFormDialog
            isReadOnly
            afterFinishesOrCancel={handleTogglePopover}
            transaction={transaction}
          />
          <TransactionsFormDialog
            afterFinishesOrCancel={handleTogglePopover}
            transaction={transaction}
          />
          <DialogRemoveButton
            afterFinishesOrCancel={handleTogglePopover}
            confirm={onClickRemoveTransaction} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
