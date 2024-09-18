export const signup = async (username: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/signup', {
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
