import { forwardRef, useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DialogRemoveButtonProps = {
  confirm: () => Promise<boolean>
  afterFinishesOrCancel: () => void
}

export const DialogRemoveButton = forwardRef<HTMLButtonElement, DialogRemoveButtonProps>(
  ({ confirm, afterFinishesOrCancel }, ref) => {
    const [open, setIsOpen] = useState(false)

    const toggleIsOpen = useCallback(() => {
      setIsOpen(prev => !prev)
    }, [])

    const onClickConfirmButton = useCallback(async () => {
      if (await confirm()) {
        toggleIsOpen()
        afterFinishesOrCancel()
      }
    }, [confirm, toggleIsOpen, afterFinishesOrCancel])

    return (
      <Dialog open={open} onOpenChange={open => setIsOpen(open)}>
        <DialogTrigger asChild>
          <Button className="bg-red-500 font-semibold" ref={ref}>
            <Trash2 className="me-2" />
            Remover
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]"
          // TODO: ver isso com calma
          aria-label="calendar"
          aria-description="Game schedule for the Boston Red Sox 2021"
        >
          <DialogHeader>
            <DialogTitle>Atenção!</DialogTitle>
          </DialogHeader>
          <div className="text-red-500 font-medium">
            Você realmente deseja remover essa transação?
          </div>
          <DialogFooter>
            <Button onClick={() => toggleIsOpen()} variant="outline" type="button">Cancelar</Button>
            <Button onClick={onClickConfirmButton} className="bg-red-500 font-semibold" type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  })

DialogRemoveButton.displayName = "DialogRemoveButton"
