import React, { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: React.ReactNode
}

export const TransactionFormContainer: FC<Props> = ({ children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de transações</CardTitle>
        <CardDescription>Gerencia suas transações</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
