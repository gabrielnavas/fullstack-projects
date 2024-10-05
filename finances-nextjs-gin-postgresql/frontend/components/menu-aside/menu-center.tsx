"use client"

import React, { FC } from "react"

import { CommandDialog } from "@/components/ui/command"
import { MenuAsideList } from "./menu-list"

type Props = {
  isOpen: boolean
  onChangeOpen: (open: boolean) => void
}

export const MenuCenter: FC<Props> = ({
  isOpen,
  onChangeOpen
}) => {


  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey ) && e.key === 'm') {
        onChangeOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onChangeOpen, isOpen])

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onChangeOpen}>
      <MenuAsideList />
    </CommandDialog>
  )
}
