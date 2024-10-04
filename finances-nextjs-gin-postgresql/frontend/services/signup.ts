import { ServiceResult } from "./service-result"

const url = process.env.NEXT_PUBLIC_ENDPOINT_API || ''

type SignupParams = {
  fullname: string
  email: string
  password: string
}

const possibleErrors = ['já existe um usuário com esse e-mail']

export const signUp = async (data: SignupParams): Promise<ServiceResult<void>> => {
  const signupUrl = `${url}/auth/signup`
  const result = await fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })
  if (result.status >= 400 && result.status <= 499) {
    const body = await result.json()
    if (possibleErrors.some(msg => msg == body.message)) {
      return {
        error: true,
        message: body.message,
      }
    }
  }

  if (result.status >= 200 && result.status <= 299) {
    const body = await result.json()
    return {
      error: false,
      message: body.message,
    }
  }

  return {
    error: true,
    message: "chame o admin",
  }
}