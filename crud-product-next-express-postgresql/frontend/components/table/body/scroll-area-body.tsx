import { FC } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

interface IScrollAreaBodyProps {
  children: React.ReactNode
};

export const ScrollAreaBody: FC<IScrollAreaBodyProps> = ({
  children
}) => {
  return (
    <ScrollArea className="h-[80vh] w-[100%] rounded-md border mb-2">
      {children}
    </ScrollArea>
  );
}
