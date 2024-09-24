import { ServiceResult } from "./service-result";

const url = process.env.NEXT_PUBLIC_ENDPOINT_API || ''

type SignInParams = {
  email: string
  password: string
}

export const signIn = async (data: SignInParams): Promise<ServiceResult<string>> => {
  const signupUrl = `${url}/auth/signin`
  const result = await fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const body = await result.json()
  const token = body.data as string

  return {
    error: !result.ok,
    message: body.message,
    data: token
  }
}