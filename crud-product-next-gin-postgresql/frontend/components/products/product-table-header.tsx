import { FC } from "react";

import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { TableHeadStart } from "@/components/table/header/table-header-start";
import { TableHeaderEnd } from "@/components/table/header/table-header-end";

export const ProductTableHeader: FC = (props) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHeadStart>Name</TableHeadStart>
        <TableHead className="hidden md:table-cell">Description</TableHead>
        <TableHead className="hidden md:table-cell">Price</TableHead>
        <TableHead className="hidden md:table-cell">Quantity</TableHead>
        <TableHead className="hidden md:table-cell">Created at</TableHead>
        <TableHead className="hidden md:table-cell">Updated at</TableHead>
        <TableHeaderEnd>Actions</TableHeaderEnd>
      </TableRow>
    </TableHeader>
  );
}
