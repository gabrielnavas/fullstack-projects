import { FC, ReactNode, useCallback, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IDeleteDialogButtonProps {
  title: string
  description: string
  messageHover: string
  confirm: () => Promise<boolean>
  icon: ReactNode
};

export const DeleteDialogButton: FC<IDeleteDialogButtonProps> = ({
  title,
  description,
  confirm,
  icon,
  messageHover
}) => {
  const [open, setOpen] = useState(false);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [])

  const handleConfirm = useCallback(async () => {
    if (await confirm()) {
      setOpen(false);
    }
  }, [confirm])

  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
                {icon}
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleConfirm}>Yes</Button>
          </DialogClose>
          <Button variant="outline" onClick={handleCancel}>No</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
