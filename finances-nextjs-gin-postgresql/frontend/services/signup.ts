type Result = {
  error: boolean
  message: string
}

const url = process.env.NEXT_PUBLIC_ENDPOINT_API || ''

type SignupParams = {
  fullname: string
  email: string
  password: string
}

export const signUp = async (data: SignupParams): Promise<Result> => {
  debugger
  const signupUrl = `${url}/auth/signup`
  const result = await fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const body = await result.json()

  return {
    error: !result.ok,
    message: body.message,
  }
}