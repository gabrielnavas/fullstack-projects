'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const route = useRouter()

  const handleSignIn = useCallback(async (username: string, password: string) => {
    const response = await fetch('http://localhost:3001/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      },
      body: JSON.stringify({username, password})
    })

    const body = await response.json()

    alert(JSON.stringify(body))
    alert(JSON.stringify(response.ok))

    return {
      error: !response.ok,
      message:  body.message,
      token: response.ok ? body.data.token : undefined
    }
  }, [])
  
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await handleSignIn(form.username, form.password)
    if(result.error) {
      alert(result.message)
    } else {
      debugger
      if(result.token != undefined) {
        alert('logado!')
        localStorage.setItem("token", result.token)
        route.push('/')
      } else {
        alert('ocorreu um erro!')
      }
    }
  }, [form, handleSignIn, route])

  return (
    <form onSubmit={handleSubmit}>
       <Input type="text" placeholder="Username" value={form.username} onChange={e => setForm(prev => ({...prev, username: e.target.value}))} />
       <Input type="password" placeholder="Password" onChange={e => setForm(prev => ({...prev, password: e.target.value}))} />
       <Button variant="outline">Login</Button>
    </form>
  );
}

export default SignIn