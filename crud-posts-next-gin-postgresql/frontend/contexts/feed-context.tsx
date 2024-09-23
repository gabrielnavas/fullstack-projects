import React from "react";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

import { AuthContext, AuthContextType } from "@/contexts/auth-context";

import { Post } from "@/services/post/post";
import { insertPost } from "@/services/post/insert-posts";
import { findPosts } from "@/services/post/find-posts";
import { findNewPosts } from "@/services/post/find-new-posts";

import {
  TYPE_COUNT_NEW_POSTS,
  WebSocketContext,
  WebSocketContextType

} from "./web-socket-context";

interface FeedContextProviderProps {
  children: React.ReactNode
}

export type FeedContextType = {
  posts: Post[]
  handleInsertPost: (description: string) => Promise<boolean>
  handleFindNewPosts: () => void
  countNewPosts: number
}

export const FeedContext = React.createContext<FeedContextType | null>(null)

type CountNewPosts = {
  countNewPosts: number
}

export const FeedContextProvider: React.FC<FeedContextProviderProps> = ({ children }) => {
  const { token } = React.useContext(AuthContext) as AuthContextType
  const { messages, sendMessage, removeMessage } = React.useContext(WebSocketContext) as WebSocketContextType

  const [posts, setPosts] = React.useState<Post[]>([])

  const [countNewPosts, setCountNewPosts] = React.useState<number>(0)

  const { toast } = useToast()

  const route = useRouter()

  React.useEffect(() => {
    const handleFindPosts = async () => {
      if (!token || token.length === 0) {
        return
      }
      const result = await findPosts(token)()
      if (!result.error && result.data !== undefined) {
        setPosts(result.data)
      } else {
        alert(result.message)
      }
    }
    handleFindPosts();
  }, [token]);

  React.useEffect(() => {
    for (const message of messages) {
      if (message.type === TYPE_COUNT_NEW_POSTS) {
        const count = (message.data as CountNewPosts).countNewPosts
        setCountNewPosts(count)
        removeMessage(message)
      }
    }
  }, [messages, removeMessage])

  React.useEffect(() => {
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


  const handleInsertPost = React.useCallback(async (description: string): Promise<boolean> => {
    let success = false

    const result = await insertPost(token)(description)
    if (!result.iAuthorized) {
      route.replace("/signin")
    } else if (!result.error && result.data !== undefined) {
      toast({ title: "Posted!", duration: 3000 })
      const newPost = result.data
      setPosts(prev => [{ ...newPost }, ...prev])
      success = true
    } else {
      toast({
        title: "Ooops!",
        description: result.message,
        variant: 'destructive',
      })
    }

    return success
  }, [token, toast, route])

  const handleFindNewPosts = React.useCallback(async () => {
    if (!posts || posts.length === 0 || !token || token.length === 0) {
      return
    }

    function filterDuplicated(oldPosts: Post[], newPosts: Post[]): Post[] {
      return newPosts.filter(newPost =>
        oldPosts.some(oldPost => oldPost.id !== newPost.id)
      )
    }

    const firstPost = posts[0]
    const timestampAfter = firstPost.createdAt
    const result = await findNewPosts(token)(timestampAfter)

    if (!result.iAuthorized) {
      return route.replace("/signin")
    }

    if (!result.error && result.data !== undefined) {
      setPosts(prev => {
        const oldPosts = [...prev]
        const newPosts = filterDuplicated(oldPosts, [...result.data!])
        return newPosts.concat(oldPosts)
      })

      setCountNewPosts(0)
    }
  }, [posts, token, route])


  return (
    <FeedContext.Provider value={{
      posts,
      handleInsertPost,
      handleFindNewPosts,
      countNewPosts,
    }}>
      {children}
    </FeedContext.Provider>
  );
}
