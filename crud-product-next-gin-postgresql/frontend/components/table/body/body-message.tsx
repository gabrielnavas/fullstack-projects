import { TableCaption } from "@/components/ui/table";

import { FC } from "react";

interface IBodyMessageProps {
    isShow: boolean
    message: string
};

export const BodyMessage: FC<IBodyMessageProps> = ({
    isShow
}) => {
    if (!isShow) {
        return null
    }
    return (
        <TableCaption className="self-center m-4 text-xl">
            Produtos não encontrados.
        </TableCaption>
    )
}
