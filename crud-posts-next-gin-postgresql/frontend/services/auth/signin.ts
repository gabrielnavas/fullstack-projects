export const signin = async (username: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'applications/json'
    },
    body: JSON.stringify({username, password})
  })

  const body = await response.json()

  return {
    error: !response.ok,
    message:  body.message,
    token: response.ok ? body.data.token : undefined,
    user: response.ok ? {
      username: body.data.username,
    } : undefined,
  }
}
