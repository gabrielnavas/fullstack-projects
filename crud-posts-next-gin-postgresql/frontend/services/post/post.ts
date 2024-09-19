export type Post = {
  id: string
  description: string
  viewsCount: number
  likesCount: number
  createdAt: Date
  updatedAt: Date | null
  ownerId: string
}