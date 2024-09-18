'use client'

import { useCallback, useContext, useLayoutEffect } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { signin } from "@/services/auth/signin"
import { AuthContext, AuthContextType } from "@/app/contexts/auth-context"
import { AuthContainer } from "@/components/auth/auth-container"
import { useToast } from "@/hooks/use-toast"
import { capitalizeText } from "@/utils/strings"
import { ErrorMessage } from "@/components/shared/form/error-message"

import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string()
    .min(2, { message: 'Minimum 2 characters required' })
    .max(50, { message: 'Maximum 50 characters allowed' }),
  password: z.string()
    .min(8, { message: 'Minimum 8 characters required' })
    .max(70, { message: 'Maximum 70 characters allowed' }),
});

type Form = z.infer<typeof formSchema>

const SignIn = () => {
  const { isAuthCheck, handleSignin } = useContext(AuthContext) as AuthContextType

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  })

  const route = useRouter()

  const { toast } = useToast()

  useLayoutEffect(() => isAuthCheck(), [isAuthCheck])

  const onSubmit = useCallback(async (data: Form) => {
    const result = await signin(data.username, data.password)
    if (result.error) {
      toast({
        title: "Ooops!",
        description: capitalizeText(result.message),
        variant: 'destructive',
      })
    } else {
      if (result.token != undefined && result.user != undefined) {
        handleSignin(result.token, result.user)
        route.push('/')
        toast({
          title: "Welcome!",
        })
      } else {
        alert('ocorreu um erro!')
      }
    }
  }, [handleSignin, route, toast])

  return (
    <AuthContainer sideText="Enter on App!" childrenSide='left'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" >
        <div>
          <Input {...register('username')} type="text" placeholder="Username" />
          <ErrorMessage message={errors.username?.message} />
        </div>
        <div>
          <Input {...register('password')} type="password" placeholder="Password" />
          <ErrorMessage message={errors.password?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Button>Login</Button>
          <Button type="button" variant="outline" onClick={() => route.push('/signup')}>{"I'm not have an Account"}</Button>
        </div>
      </form>
    </AuthContainer>
  );
}

export default SignIn