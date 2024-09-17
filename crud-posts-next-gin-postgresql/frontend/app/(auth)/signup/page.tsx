'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useCallback, useState } from "react";

const SignUp: FC = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const route = useRouter()

  const handleSignUp = useCallback(async (username: string, password: string) => {
    const response = await fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      },
      body: JSON.stringify({username, password})
    })

    const data = await response.json()

    return {
      error: !response.ok,
      message:  data.message,
    }
  }, [])
  
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await handleSignUp(form.username, form.password)
    if(result.error) {
      alert(result.message)
    } else {
      route.push('/signin')
    }
  }, [form, handleSignUp, route])

  return (
    <form onSubmit={handleSubmit}>
       <Input type="text" placeholder="Username" value={form.username} onChange={e => setForm(prev => ({...prev, username: e.target.value}))} />
       <Input type="password" placeholder="Password" onChange={e => setForm(prev => ({...prev, password: e.target.value}))} />
       <Button variant="outline">Register</Button>
      SignUp
    </form>
  );
}

export default SignUp