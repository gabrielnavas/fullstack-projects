import { Post } from "./post"

export type PostData = {
  id: string
  description: string
  viewsCount: number
  likesCount: number
  createdAt: string
  updatedAt: string | null
  ownerId: string
}

export const fromDataToPost = (post: PostData): Post => ({
  id: post.id,
  createdAt: new Date(post.createdAt),
  description: post.description,
  likesCount: post.likesCount,
  ownerId: post.ownerId,
  updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
  viewsCount: post.viewsCount
})
