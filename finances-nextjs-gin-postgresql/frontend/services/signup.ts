type Result = {
  error: boolean
  message: string
}

const url = process.env.NEXT_PUBLIC_ENDPOINT_API || ''

export const signUp = async (email: string, password: string): Promise<Result> => {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email, password
    })
  })

  const body = await result.json()

  return {
    error: !result.ok,
    message: body.message,
  }
}