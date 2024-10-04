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

type Props = {
  transactionId: string
}

export const TransactionListOptions: FC<Props> = ({
  transactionId,
}) => {
  const {
    handleRemoveTransaction
  } = useContext(TransactionContext) as TransactionContextType

  const onClickRemoveTransaction = useCallback(async (): Promise<boolean> => {
    try {
      return await handleRemoveTransaction(transactionId)
    }
    catch {
      return false
    }
  }, [transactionId, handleRemoveTransaction])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <DialogRemoveButton confirm={onClickRemoveTransaction} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
