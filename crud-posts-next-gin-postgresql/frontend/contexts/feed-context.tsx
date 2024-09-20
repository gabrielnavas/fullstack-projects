import { Post } from "@/services/post/post";
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { insertPost } from "@/services/post/insert-posts";
import { useToast } from "@/hooks/use-toast";
import { findPosts } from "@/services/post/find-posts";
import { TYPE_COUNT_NEW_POSTS, WebSocketContext, WebSocketContextType } from "./web-socket-context";

interface FeedContextProviderProps {
  children: ReactNode
}

export type FeedContextType = {
  posts: Post[]
  handleInsertPost: (description: string) => void
  countNewPosts: number
}

export const FeedContext = createContext<FeedContextType | null>(null)

type CountNewPosts = {
  countNewPosts: number
}

export const FeedContextProvider: FC<FeedContextProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext) as AuthContextType
  const { messages, sendMessage, removeMessage } = useContext(WebSocketContext) as WebSocketContextType

  const [posts, setPosts] = useState<Post[]>([])

  const [countNewPosts, setCountNewPosts] = useState<number>(0)

  const { toast } = useToast()

  useEffect(() => {
    const handleFindPosts = async () => {
      if (!token || token.length === 0) {
        return
      }
      const result = await findPosts(token)()
      if (!result.error) {
        setPosts(result.posts)
      } else {
        alert(result.message)
      }
    }
    handleFindPosts();
  }, [token]);

  useEffect(() => {
    for (const message of messages) {
      if (message.type === TYPE_COUNT_NEW_POSTS) {
        const count = (message.data as CountNewPosts).countNewPosts
        setCountNewPosts(count)
        removeMessage(message)
      }
    }
  }, [messages, removeMessage])

  useEffect(() => {
    const checkCountNewPosts = () => {
      if (!posts || posts.length === 0) {
        return
      }
      const firstPost = posts[0]
      sendMessage({
        type: 'COUNT_NEW_POSTS',
        token,
        body: {
          timestampAfter: firstPost.createdAt.toISOString()
        },
      })
    }
    const interval = setInterval(() => checkCountNewPosts(), 3000)

    return () => clearInterval(interval)
  }, [posts, token, sendMessage])


  const handleInsertPost = useCallback(async (description: string) => {
    const result = await insertPost(token)(description)
    if (!result.error) {
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
  }, [token, toast])

  return (
    <FeedContext.Provider value={{
      posts,
      handleInsertPost,
      countNewPosts,
    }}>
      {children}
    </FeedContext.Provider>
  );
}
