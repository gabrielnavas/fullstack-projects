import { FC, useContext } from "react";

import { CircleX } from "lucide-react";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { TableContext } from "@/context/product-context";
import { TableContextType } from "@/context/types";
import { fromNow } from "@/utils/date";
import { getLanguage } from "@/utils/string";
import { DeleteDialogButton } from "@/components/table/body/delete-dialog-button-yes-no";
import { UpdateViewProductButtonDialog } from "@/components/products/update-view-product-dialog";

import { getCurrency } from "@/utils/string";

export const ProductTableRows: FC = () => {

  const {
    handleDeleteProduct,
    table,
  } = useContext(TableContext) as TableContextType

  return (
    table.data.map(item => (
      <TableRow key={item.id}>
        <TableCell className="font-medium max-w-[150px] truncate">{item.name}</TableCell>
        <TableCell className="hidden md:table-cell max-w-[170px] truncate">{item.description}</TableCell>
        <TableCell className="hidden md:table-cell">{item.price.toLocaleString(getLanguage(), { style: 'currency', currency: getCurrency() })}</TableCell>
        <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
        <TableCell className="hidden md:table-cell">{fromNow(item.createdAt)}</TableCell>
        <TableCell className="hidden md:table-cell">{item.updatedAt !== null ? fromNow(item.updatedAt) : '-'}</TableCell>
        <TableCell className="flex justify-end">
          <div className="flex gap-2 ">
            <DeleteDialogButton
              messageHover="Click here to delete this product."
              icon={<CircleX color="red" />}
              description="Do you really want to remove this item?"
              title="Attention!"
              confirm={() => handleDeleteProduct(item)} />
            <UpdateViewProductButtonDialog
              readonly={false}
              messageHover="Click here to update this product."
              product={item} />
            <UpdateViewProductButtonDialog
              readonly={true}
              messageHover="Click here to view this product."
              product={item} />
          </div>
        </TableCell>
      </TableRow>
    ))
  );
}
