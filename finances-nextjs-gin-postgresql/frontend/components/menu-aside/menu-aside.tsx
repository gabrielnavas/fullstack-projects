import {
  Command,
} from "@/components/ui/command"
import { MenuAsideList } from "./menu-list"

export const MenuAside = () => {
  return (
    <Command className="
    hidden 
    lg:flex 
    rounded-lg 
    border 
    shadow-md 
    w-[220px] 
    m-4 me-1 p-1">
      <MenuAsideList />
    </Command>
  )
}
