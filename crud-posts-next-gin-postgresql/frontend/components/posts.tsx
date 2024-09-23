import React from "react";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";

import { Post } from "@/components/post";
import { AlertNewPosts } from "./alert-new-posts";


export const Posts: React.FC = () => {
  const { posts } = React.useContext(FeedContext) as FeedContextType

  return (
    <div className="
      flex flex-col 
      gap-y-3
      w-[310px] sm:w-[350px] md:w-[550px] lg:w-[768px] xl:w-[1050px] 2xl:w-[1390px]">
      <AlertNewPosts />

      {posts.map(post => (
        <Post
          key={post.id}
          post={post} />
      ))}
    </div>
  );
}
