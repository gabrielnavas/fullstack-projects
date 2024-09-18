'use client'

import {
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signup } from "@/services/auth/signup";

import { AuthContext, AuthContextType } from "@/app/contexts/auth-context";
import { AuthContainer } from "@/components/auth/auth-container";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/components/shared/form/error-message";

const formSchema = z.object({
  username: z.string()
    .min(2, { message: 'Minimum 2 characters required' })
    .max(50, { message: 'Maximum 50 characters allowed' }),
  password: z.string()
    .min(8, { message: 'Minimum 8 characters required' })
    .max(70, { message: 'Maximum 70 characters allowed' }),
});

type Form = z.infer<typeof formSchema>

const SignUp: FC = () => {
  const { isAuthCheck } = useContext(AuthContext) as AuthContextType

  const route = useRouter()

  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  })

  useLayoutEffect(() => isAuthCheck(), [isAuthCheck])

  const onSubmit = useCallback(async (data: Form) => {
    const result = await signup(data.username, data.password)
    if (result.error) {
      toast({
        title: "Ooops!",
        description: result.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: "Account created!",
      })
      route.push('/signin')
    }
  }, [toast, route])

  return (
    <AuthContainer sideText="Create Account!" childrenSide='right' >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" >
        <div>
          <Input {...register('username')} type="text" placeholder="Username" />
          <ErrorMessage message={errors.username?.message} />
        </div>
        <div>
          <Input  {...register('password')} type="password" placeholder="Password" />
          <ErrorMessage message={errors.password?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="submit">Register</Button>
          <Button type="button" variant="outline" onClick={() => route.push('/signin')}>Already have an Account</Button>
        </div>
      </form>
    </AuthContainer>
  );
}

export default SignUp