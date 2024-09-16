"use client"

import { FC, useCallback, useEffect, useState } from "react";

import { ThumbsUp, View } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { findPosts } from "@/services/posts/find-posts";
import { Post } from "@/services/posts/post";

const Feed: FC = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    handleFindPosts();
  }, []);

  const handleFindPosts = useCallback(async () => {
    const posts = await findPosts()
    setPosts(posts)
  }, [])

  const handlePostLike = useCallback(async (postId: string) => {
    alert(postId)
  }, [])

  return (
    <div>{posts.map(post => (
      <Card key={post.id} className="m-4">
        <CardHeader>
          <CardDescription>
            {'@'}
            <span className="font-base">{post.ownerName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{post.description}</p>
        </CardContent>
        <CardFooter className="flex gap-x-4 p-4 border-t-2">
          <div className="flex gap-2">
            <Button variant='outline'>
              <View />
              <span className="font-semibold ms-2">
                {post.views}
              </span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant='outline'>
              <ThumbsUp />
              <span className="font-semibold ms-2" onClick={() => handlePostLike(post.id)}>
                {post.likes}
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    ))}
    </div>
  );
}

export default Feed;