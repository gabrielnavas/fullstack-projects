import { FC, useState } from "react";

import { Eye, RotateCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Product } from "@/services/products/product";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { ProductForm } from "@/components/products/form/product-form";


interface IProductUpdateProps {
  product: Product
  messageHover: string
  readonly: boolean
};

export const UpdateViewProductButtonDialog: FC<IProductUpdateProps> = ({
  product,
  messageHover,
  readonly
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {readonly ? (
                <Button className="w-full" variant='outline'>
                  <Eye color="cyan" />
                </Button>
              ) : (
                <Button className="w-full" variant='outline'><RotateCw onClick={() => setOpen(true)} color="yellow" /></Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {messageHover}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <ProductForm
          readonly={readonly}
          afterSubmitOrCancel={() => setOpen(false)} productToUpdate={product} />
      </DialogContent>
    </Dialog >
  );
}
