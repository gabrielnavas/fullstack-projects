import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { PartyPopper } from "lucide-react";
import { FeedContext, FeedContextType } from "@/contexts/feed-context";

export const AlertNewPosts: React.FC = () => {
  const { handleFindNewPosts, countNewPosts } = React.useContext(FeedContext) as FeedContextType

  if (countNewPosts === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex justify-center items-center p-2">
        <Button variant='outline' size='sm' onClick={() => handleFindNewPosts()}>
          <PartyPopper />
          <span className="font-bold">
            You have {countNewPosts} new {countNewPosts === 0 ? 'Post' : 'Posts'}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
