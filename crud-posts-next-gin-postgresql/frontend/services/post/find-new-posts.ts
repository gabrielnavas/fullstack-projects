import { fromDataToPost } from "./map"
import { Post } from "./post"

const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts/news`

type Result = {
  error: boolean
  message: string
  posts: Post[]
}

export const findNewPosts = (token: string) => async (timestampAfter: Date): Promise<Result> => {
  const urlDynamic = `${url}/${timestampAfter.toISOString()}`
  const response = await fetch(urlDynamic, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const body = await response.json()
  return {
    error: !response.ok,
    message: body.message,
    posts: body.data.map(fromDataToPost),
  }
}
