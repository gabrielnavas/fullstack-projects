import React, { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: React.ReactNode
}

export const TransactionFormContainer: FC<Props> = ({ children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova transação</CardTitle>
        <CardDescription>Entre com os dados</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
