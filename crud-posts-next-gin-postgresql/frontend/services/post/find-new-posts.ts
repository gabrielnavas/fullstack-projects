import { httpUnauthorized } from "../shared/http-results"
import { isHttpUnauthorized } from "../shared/http-status"
import { Result } from "../shared/types"
import { fromDataToPost } from "./map"
import { Post } from "./post"

const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts/news`

export const findNewPosts = (token: string) =>
  async (timestampAfter: Date): Promise<Result<Post[]>> => {
    const urlDynamic = `${url}/${timestampAfter.toISOString()}`
    const response = await fetch(urlDynamic, {
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
      error: !response.ok,
      message: body.message,
      data: body.data.map(fromDataToPost),
    }
  }
