import { FC } from "react";

import { DollarSign, MoveDown, MoveUp } from "lucide-react";

import { TypeTransaction } from "@/services/models";

interface Props {
  typeTransaction: TypeTransaction
};

export const TypeTransactionTypeNameIcon: FC<Props> = ({
  typeTransaction,
}) => {
  return (
    <div className="flex items-center">
      <DollarSign color="gray" size={17} />
      {
        typeTransaction.name === 'income'
          ? <MoveUp size={17} color="red" />
          : <MoveDown color="green" />
      }
      {typeTransaction.displayName}
    </div>
  );
}
