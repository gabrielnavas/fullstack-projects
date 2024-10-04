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
}

export const DialogRemoveButton = forwardRef<HTMLButtonElement, DialogRemoveButtonProps>(
  ({ confirm }, ref) => {
    const [open, setOpen] = useState(false)

    const toggleOpen = useCallback(() => {
      setOpen(prev => !prev)
    }, [])

    const onClickConfirmButton = useCallback(async () => {
      if(await confirm()) {
        toggleOpen()
      }
    }, [confirm, toggleOpen])

    return (
      <Dialog open={open} onOpenChange={open => setOpen(open)}>
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
            <Button onClick={() => toggleOpen()} variant="outline" type="button">Cancelar</Button>
            <Button onClick={onClickConfirmButton} className="bg-red-500 font-semibold" type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  })

DialogRemoveButton.displayName = "DialogRemoveButton"
