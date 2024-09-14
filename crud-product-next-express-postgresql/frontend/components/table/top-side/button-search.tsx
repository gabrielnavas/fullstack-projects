import { FC } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface IButtonSearchProps {
  submit: () => void
  helpMessage: string
};

export const ButtonSearch: FC<IButtonSearchProps> = ({
  submit,
  helpMessage
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="w-[100px] ms-1" onClick={() => submit()}>
            <Search />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {helpMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
