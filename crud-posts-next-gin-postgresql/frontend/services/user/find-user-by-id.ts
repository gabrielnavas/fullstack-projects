'use client'

import { User } from "./user"

const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`

type Result = {
  error: boolean
  message: string
  user: User | null
}

export const findUserById = (token: string) => async (userId: string): Promise<Result> => {
  const response = await fetch(`${url}/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'json/application'
    }
  })
  const body = await response.json()
  return {
    error: !response.ok,
    message: body.message,
    user: body.data
  }
}