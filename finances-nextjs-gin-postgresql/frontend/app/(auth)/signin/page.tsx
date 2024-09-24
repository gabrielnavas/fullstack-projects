'use client'

import React, { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { LogIn, UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContainer } from "@/components/auth/auth-container";
import { FormMessageError } from "@/components/form-message-error";

import { AuthContext, AuthContextType } from "@/context/auth-context";

const formSchema = z.object({
  email: z.string().email('O E-mail está inválido'),

  // TODO: melhorar a segurança com numeros, símbolos e letras, uppercase e lowercase
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(70, 'A senha não deve ultrapassar 70 caracteres'),
});

type Form = z.infer<typeof formSchema>

const SignInPage = () => {

  const {
    isLoading,
    handleSignIn,
    isAuthenticated
  } = useContext(AuthContext) as AuthContextType

  const route = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    if (isAuthenticated()) {
      route.replace("/dashboard")
    }
  }, [isAuthenticated, route])

  const onSubmit = React.useCallback(async (data: Form) => {
    handleSignIn(data.email, data.password)
  }, [handleSignIn])

  return (
    <AuthContainer title="Faça o login" description="Entre com suas credenciais" >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3.5">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email" className="font-semibold">E-mail *</Label>
          <Input disabled={isLoading} {...register('email')} id="email" placeholder="Ex. john@email.com" />
          <FormMessageError message={errors.email?.message} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password" className="font-semibold">Senha *</Label>
          <Input disabled={isLoading} {...register('password')} type="password" id="password" placeholder="********" />
          <FormMessageError message={errors.password?.message} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Button className="font-semibold">
            <LogIn className="me-2" />
            Entrar
          </Button>
          <Button
            disabled={isLoading}
            variant='outline'
            type="button"
            onClick={() => route.push("/signup")}
            className="font-semibold">
            <UserRoundPlus className="me-2" />
            Ainda não tenho uma conta</Button>
        </div>
      </form>
    </AuthContainer>
  );
}

export default SignInPage