import { Result } from "../shared/types"
import { fromDataToPost } from "./map"
import { Post } from "./post"
import { isHttpUnauthorized } from "../shared/http-status"
import { httpUnauthorized } from "../shared/http-results"

const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts`

export const findPosts = (token: string) => async (): Promise<Result<Post[]>> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if(isHttpUnauthorized(response.status)) {
    return httpUnauthorized()
  }
  const body = await response.json()
  return {
    iAuthorized: true,
    error: !response.ok,
    message: body.message,
    data: body.data.map(fromDataToPost),
  }
}