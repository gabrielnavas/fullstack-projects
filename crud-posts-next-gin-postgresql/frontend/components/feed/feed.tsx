import React from "react";

import { PartyPopper } from "lucide-react";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Post } from "@/components/post";
import { NewPostForm } from "@/components/feed/new-post-form";

export const Feed: React.FC = () => {
  const { handleFindNewPosts, posts, countNewPosts } = React.useContext(FeedContext) as FeedContextType

  return (
    <>
      <Card className="m-4">
        <NewPostForm />
      </Card>

      <div>
        {countNewPosts > 0 && (
          <Card className="m-4 border-none shadow-none">
            <CardContent className="flex justify-center items-center p-2">
              <Button variant='outline' size='sm' onClick={() => handleFindNewPosts()}>
                <PartyPopper />
                <span className="font-bold">
                  You have {countNewPosts} new {countNewPosts === 0 ? 'Post' : 'Posts'}
                </span>
              </Button>
            </CardContent>
          </Card>
        )}

        {posts.map(post => (
          <Post
            key={post.id}
            post={post} />
        ))}
      </div>
    </>
  );
}
