'use client'

import { FC, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react";
import { menuPaths } from "../menu-left/menu-paths";
import Link from "next/link";
import { Button } from "../ui/button";

export const MenuMobile: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={open => setIsOpen(open)}>
        <SheetTrigger className="flex justify-center">
          <MenuIcon className="w-6 h-6 m-1 hover:scale-125 transition-transform" />
        </SheetTrigger>
        <SheetContent side='left' className="w-[250px]">
          <SheetHeader>
            <SheetTitle className="text-center">
              Menu
            </SheetTitle>
            <SheetDescription asChild>
              <div>
                {menuPaths.map(path => (
                  <SheetClose asChild key={path.title}>
                    <Link href={path.path} key={path.title}>
                      <Button
                        variant='link'
                        className="border w-[100%] mb-1">
                        {path.title}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
