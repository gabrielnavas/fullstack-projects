import { Post } from "./post"

const urlApi = 'http://localhost:3001/posts'

export const findPosts = async () => {
  const response = await fetch(urlApi)
  return await response.json() as Post[]
}