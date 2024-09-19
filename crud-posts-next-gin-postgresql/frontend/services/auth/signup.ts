export const signup = async (username: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'applications/json'
    },
    body: JSON.stringify({ username, password })
  })

  const data = await response.json()

  return {
    error: !response.ok,
    message: data.message,
  }
}
