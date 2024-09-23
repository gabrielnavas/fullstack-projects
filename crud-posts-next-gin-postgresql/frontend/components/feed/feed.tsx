import React from "react";

import { Card } from "@/components/ui/card";

import { NewPostForm } from "@/components/feed/new-post-form";
import { Posts } from "../posts";

export const Feed: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Card className="
        m-4
        w-[310px] sm:w-[350px] md:w-[550px] lg:w-[768px] xl:w-[1050px] 2xl:w-[1390px]">
        <NewPostForm />
      </Card>
      <Posts />
    </div>
  );
}
