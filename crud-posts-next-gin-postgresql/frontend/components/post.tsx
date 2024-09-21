import React from "react";

import { Delete, Menu, ThumbsUp, View } from "lucide-react";

import { AuthContext, AuthContextType } from "@/contexts/auth-context";

import { findUserById } from "@/services/user/find-user-by-id";
import { User } from "@/services/user/user";
import { Post as PostData } from "@/services/post/post";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";


interface IPostProps {
  post: PostData
};

export const Post: React.FC<IPostProps> = ({ post }) => {
  const [owner, setOwner] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const { token } = React.useContext(AuthContext) as AuthContextType

  React.useEffect(() => {
    async function handleFindOwnerById() {
      console.log('find owner by id');
      if (owner !== null || !token || token.length === 0 || !post || !post.ownerId) {
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
    }

    handleFindOwnerById()
  }, [owner, post, token])

  return (
    <Card key={post.id} className="m-4">
      <CardHeader>
        <CardDescription className="flex justify-between items-center">
          <div>
            {'@'}
            <span className="font-base">{isLoading ? 'Loading...' : owner?.username}</span>
          </div>
          <DropdownMenu dir="ltr">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size='icon' className="w-18">
                <Menu  className="h-6 w-10 "/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button className="w-[100%]" variant='destructive'>
                    <Delete className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
      </CardContent>
      <CardFooter className="flex gap-x-4 p-4 border-t-2">
        <div className="flex gap-2">
          <Button variant='outline'>
            <ThumbsUp />
            <span className="font-semibold ms-2" onClick={() => { }}>
              {post.likesCount}
            </span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant='secondary' className="cursor-default">
            <View />
            <span className="font-semibold ms-2">
              {post.viewsCount}
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
