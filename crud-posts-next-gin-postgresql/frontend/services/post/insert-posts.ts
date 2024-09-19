'use client'

import { Post } from "./post"

const urlApi = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts`

type Result = {
  error: boolean
  message: string
  post: Post
}

export const insertPost = (token: string) => async (description: string): Promise<Result> => {
  const response = await fetch(urlApi, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ description })
  })
  const body = await response.json()
  return {
    error: !response.ok,
    message: body.message,
    post: body.data as Post,
  }
}