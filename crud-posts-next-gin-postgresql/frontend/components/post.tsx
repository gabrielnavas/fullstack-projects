import { FC, useCallback, useContext, useEffect, useState } from "react";
import { ThumbsUp, View } from "lucide-react";

import { AuthContext, AuthContextType } from "@/app/contexts/auth-context";

import { findUserById } from "@/services/user/find-user-by-id";
import { User } from "@/services/user/user";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Post as PostData } from "@/services/post/post";

interface IPostProps {
  post: PostData
};

export const Post: FC<IPostProps> = ({ post }) => {
  const [owner, setOwner] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { token } = useContext(AuthContext) as AuthContextType
  const handleFindOwnerById = useCallback(async () => {
    console.log('find owner by id');
    if(owner !== null || !token || token.length === 0 || !post || !post.ownerId) {
      return
    }
    setIsLoading(true)
    try {
      const result = await findUserById(token)(post.ownerId)
      if (result.error) {
        console.log(result.message)
      } else {
        setOwner(result.user)
      }
    } catch (err) {
    }
    finally {
      setIsLoading(false)
    }
  }, [post, token])


  useEffect(() => {
    handleFindOwnerById()
  }, [])

  return (
    <Card key={post.id} className="m-4">
      <CardHeader>
        <CardDescription>
          {'@'}
          <span className="font-base">{isLoading ? 'Loading...' : owner?.username}</span>
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
              {post.viewsCount}
            </span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant='outline'>
            <ThumbsUp />
            <span className="font-semibold ms-2" onClick={() => { }}>
              {post.likesCount}
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
