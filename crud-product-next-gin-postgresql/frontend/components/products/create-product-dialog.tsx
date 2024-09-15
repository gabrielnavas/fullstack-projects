import { FC, useState } from "react";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ProductForm } from "@/components/products/form/product-form";

export const CreateProductButtonDialog: FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog open={dialogOpen} onOpenChange={open => setDialogOpen(open)}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-100 hover:bg-slate-300 active:bg-slate-100 border-[1px] border-black"
                onClick={() => setDialogOpen(true)}>
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <ProductForm 
                readonly={false} 
                afterSubmitOrCancel={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          Click here to create a product.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
