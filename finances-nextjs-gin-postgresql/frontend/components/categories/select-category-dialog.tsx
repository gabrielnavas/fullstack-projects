import { FC } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

import { Button } from "../ui/button";
import { CategoryTable } from "./category-table";

export const SelectCategoryDialog: FC = () => {
    return (
      <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione a categoria</DialogTitle>
        </DialogHeader>
        <CategoryTable />
      </DialogContent>
    </Dialog>
    );
}
