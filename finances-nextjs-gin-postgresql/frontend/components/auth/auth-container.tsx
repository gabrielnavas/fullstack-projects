import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface IAuthContainerProps {
  children: React.ReactNode
  title: string
  description: string
};

export const AuthContainer: React.FC<IAuthContainerProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="w-[65%] h-[375px] mt-24">
      <Card className="flex flex-col gap-4 justify-center px-8 py-4 ">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
