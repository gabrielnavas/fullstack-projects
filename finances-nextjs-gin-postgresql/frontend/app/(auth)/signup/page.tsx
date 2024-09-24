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

import { signUp } from "@/services/signup";
import { LogIn, UserRoundPlus } from "lucide-react";
import { formatMessage } from "@/utils/strings";

const formSchema = z.object({
  fullname: z.string().min(5, 'O nome completo deve ter no mínimo 5 caracteres')
    .max(70, 'O nome completo deve ter no máximo 70 caracteres')
    .refine(data => {
      const hasSpaceBetweenNames = data.split(" ").length >= 2
      return hasSpaceBetweenNames
    }, "O nome completo deve ter sobrenome"),
  email: z.string().email('O E-mail está inválido'),

  // TODO: melhorar a segurança com numeros, símbolos e letras, uppercase e lowercase
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(70, 'A senha não deve ultrapassar 70 caracteres'),
});

type Form = z.infer<typeof formSchema>

const SignUpPage = () => {

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
    const result = await signUp(data)
    const message = formatMessage(result.message)
    if (result.error) {
      toast({
        title: 'Ooops...! Algo aconteceu!',
        description: message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Faça login com sua conta!',
        description: message,
      })
      route.push("/signin")
    }
  }, [toast, route])

  return (
    <AuthContainer title="Faça um conta" description="Entre com seus dados">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3.5">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="fullname" className="font-semibold">Nome completo *</Label>
          <Input {...register('fullname')} id="fullname" placeholder="Ex. João da Silva" />
          <FormMessageError message={errors.fullname?.message} />
        </div>
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
          <Button
            className="font-semibold">
            <UserRoundPlus className="me-2" />
            Criar a conta
          </Button>
          <Button
            variant='outline'
            type="button"
            onClick={() => route.push("/signin")}
            className="font-semibold">
            <LogIn  className="me-2" />
            Já tenho uma conta
          </Button>
        </div>
      </form>
    </AuthContainer>
  );
}

export default SignUpPage