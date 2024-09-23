'use client'

import { httpUnauthorized } from "../shared/http-results"
import { isHttpUnauthorized } from "../shared/http-status"
import { Result } from "../shared/types"
import { fromDataToPost } from "./map"
import { Post } from "./post"

const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts`

export const insertPost = (token: string) =>
  async (description: string): Promise<Result<Post>> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description })
    })

    if (isHttpUnauthorized(response.status)) {
      return httpUnauthorized()
    }

    const body = await response.json()
    return {
      error: !response.ok,
      message: body.message,
      data: fromDataToPost(body.data),
    }
  }