"use client"

import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";


import { Button } from "@/components/ui/button";
import { findPosts } from "@/services/post/find-posts";
import { Post } from "@/services/post/post";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { AuthContext, AuthContextType } from "../contexts/auth-context";
import { insertPost } from "@/services/post/insert-posts";
import { Post as PostComponent } from "@/components/post";
import { useToast } from "@/hooks/use-toast";

const Feed: FC = () => {
  const [posts, setPosts] = useState<Post[]>([])

  const { token } = useContext(AuthContext) as AuthContextType

  const [description, setDescription] = useState('')

  const { toast } = useToast()

  const handleFindPosts = useCallback(async () => {
    if (!token || token.length === 0) {
      return
    }
    const result = await findPosts(token)()
    if (!result.error) {
      setPosts(result.posts)
    } else {
      alert(result.message)
    }
  }, [token])

  useEffect(() => {
    (async () => {
      await handleFindPosts();
    })()
  }, [handleFindPosts]);

  const handleInsertPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await insertPost(token)(description)
    debugger
    if (!result.error) {
      setDescription('')
      toast({ title: "Posted!", duration: 3000 })
      const newPost = result.post
      setPosts(prev => [{ ...newPost }, ...prev])
    } else {
      toast({
        title: "Ooops!",
        description: result.message,
        variant: 'destructive',
      })
    }
  }, [description, token, toast])

  return (
    <div>
      <Header />
      <div className="m-4">
        <form className="flex gap-2" onSubmit={handleInsertPost}>
          <Input type='text' placeholder="Type your text" value={description} onChange={e => setDescription(e.target.value)} />
          <Button onClick={handleInsertPost} type='submit'>Post</Button>
        </form>
      </div>

      <div>
        {posts.map(post => (
          <PostComponent
            key={post.id}
            post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;