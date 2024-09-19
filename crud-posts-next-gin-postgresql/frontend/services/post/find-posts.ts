'use client'

import { Post } from "./post"

const urlApi = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts`

type Result = {
  error: boolean
  message: string
  posts: Post[]
}

export const findPosts = (token: string) => async (): Promise<Result> => {
  const response = await fetch(urlApi, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const body = await response.json()
  return {
    error: !response.ok,
    message: body.message,
    posts: body.data as Post[],
  }
}