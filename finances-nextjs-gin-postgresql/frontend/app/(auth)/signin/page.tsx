'use client'

import React from "react";

import { useRouter } from "next/navigation";

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContainer } from "@/components/auth/auth-container";
import { FormMessageError } from "@/components/form-message-error";

import { LogIn, UserRoundPlus } from "lucide-react";
import { signIn } from "@/services/signin";

const formSchema = z.object({
  email: z.string().email('O E-mail está inválido'),

  // TODO: melhorar a segurança com numeros, símbolos e letras, uppercase e lowercase
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(70, 'A senha não deve ultrapassar 70 caracteres'),
});

type Form = z.infer<typeof formSchema>

const SignInPage = () => {

  const route = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  });

  const { toast } = useToast()

  const onSubmit = React.useCallback(async (data: Form) => {
    const result = await signIn(data)
    if (result.error) {
      toast({
        title: 'Ooops...! Algo aconteceu!',
        description: result.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Bem-vindo(a)',
        description: result.message,
      })
      route.push("/")
    }
  }, [toast, route])

  return (
    <AuthContainer title="Faça o login" description="Entre com suas credenciais" >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3.5">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email" className="font-semibold">E-mail *</Label>
          <Input {...register('email')} id="email" placeholder="Ex. john@email.com" />
          <FormMessageError message={errors.email?.message} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password" className="font-semibold">Senha *</Label>
          <Input {...register('password')} type="password" id="password" placeholder="********" />
          <FormMessageError message={errors.password?.message} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Button className="font-semibold">
            <LogIn className="me-2" />
            Entrar
          </Button>
          <Button
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