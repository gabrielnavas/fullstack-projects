import { FC } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Header: FC = () => {
    return (
      <Card className="w-[100%]">
        <CardHeader>
          <CardTitle>Finanças</CardTitle>
          <CardDescription>Gerencie suas finanças</CardDescription>
        </CardHeader>
      </Card>
    );
}
