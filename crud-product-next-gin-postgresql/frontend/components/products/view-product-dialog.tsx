import { FC, useState } from "react";

import { Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Product } from "@/services/products/product";
import { Textarea } from "@/components/ui/textarea";

interface IProductViewProps {
  product: Product
  messageHover: string
};

type Form = {
  data: Product
}

export const ViewProductButtonDialog: FC<IProductViewProps> = ({
  product,
  messageHover,
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    data: { ...product }
  })

  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline'>
                <Eye color="cyan" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {messageHover}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View a Product</DialogTitle>
          <DialogDescription>
            View product information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              disabled
              value={form.data.name}
              onChange={e => setForm(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
              id="name"
              placeholder="ex. Apple"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              disabled
              id="description"
              value={form.data.description}
              onChange={e => setForm(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
              placeholder="Ex. Apple red"
              className="col-span-3 max-h-[200px] min-h-[200px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              disabled
              id="price"
              type="number"
              value={form.data.price}
              onChange={e => setForm(prev => ({ ...prev, data: { ...prev.data, price: Number(e.target.value) } }))}
              placeholder="Ex. Apple red"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              disabled
              id="quantity"
              type="number"
              value={form.data.quantity}
              onChange={e => setForm(prev => ({ ...prev, data: { ...prev.data, quantity: Number(e.target.value) } }))}
              placeholder="Ex. 99.99"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' type="button" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
