import { FC } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ISizeOptionsSelectProps {
  sizesOptions: number[]
  totalItems: number
  size: number
  setSize: (many: number) => void
};

export const SizeOptionsSelect: FC<ISizeOptionsSelectProps> = ({
  sizesOptions,
  totalItems,
  size,
  setSize,
}) => {
  const firstOptions = sizesOptions[0];

  const tableIsEmpty = totalItems === 0
  if(tableIsEmpty) {
    return null;
  }

  const quantityenough = totalItems > firstOptions
  if(!quantityenough) {
    return null;
  }

  return (
    <Select
      defaultValue={firstOptions.toString()}
      value={size.toString()}
      onValueChange={size => setSize(Number(size))}>
      <SelectTrigger className="h-[100%] w-[180px] me-10">
        <SelectValue placeholder="Selected page size" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Selected page size</SelectLabel>
          {sizesOptions
            .filter(sizeOption => sizeOption <= totalItems)
            .map(pageOption => (
              <SelectItem key={pageOption} value={pageOption.toString()}>{pageOption} items</SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
