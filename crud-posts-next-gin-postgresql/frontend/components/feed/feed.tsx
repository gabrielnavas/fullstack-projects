import { FC, useCallback, useContext, useState } from "react";

import { PartyPopper } from "lucide-react";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Post } from "@/components/post";

export const Feed: FC = () => {
  const { handleInsertPost, posts, countNewPosts } = useContext(FeedContext) as FeedContextType

  const [description, setDescription] = useState('')

  const onSubmitInsertPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    handleInsertPost(description)
  }, [handleInsertPost, description])

  return (
    <>
      <div className="m-4">
        <form className="flex gap-2" onSubmit={onSubmitInsertPost}>
          <Input type='text' placeholder="Type your text" value={description} onChange={e => setDescription(e.target.value)} />
          <Button type='submit'>Post</Button>
        </form>
      </div>

      <div>
        {countNewPosts > 0 && (
          <Card className="m-4 border-none shadow-none">
            <CardContent className="flex justify-center items-center p-2">
              <Button variant='outline' size='sm' className="">
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
