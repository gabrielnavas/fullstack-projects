import { FC } from "react";

import {
  ArrowRightLeft,
  ChartNoAxesCombined,
} from "lucide-react"

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import Link from "next/link"

export const MenuAsideList: FC = () => {
  return (
    <>
      <CommandInput placeholder="Está procurando?" />
      <CommandList>
        <CommandEmpty>Nenhum encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <Link href='/dashboard' >
            <CommandItem className="flex gap-1 cursor-pointer ">
              <ChartNoAxesCombined className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
          </Link>
          <Link href='/transactions'>
            <CommandItem className="flex gap-1 cursor-pointer ">
              <div className="flex gap-1">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                <span>Transações</span>
              </div>
            </CommandItem>
          </Link>
        </CommandGroup>
      </CommandList>
    </>
  );
}
