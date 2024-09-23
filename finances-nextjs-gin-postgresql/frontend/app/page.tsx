'use client'

import React from "react";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/services/signup";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email('O E-mail está inválido'),

  // TODO: melhorar a segurança com numeros, símbolos e letras, uppercase e lowercase
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(70, 'A senha não deve ultrapassar 70 caracteres'),
});

type Form = z.infer<typeof formSchema>

const FormMessageError = ({ message }: { message?: string }) => (
  message ? <div className="text-red-500 font-medium">{message}</div> : null
)

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  });

  const {toast} = useToast()

  const onSubmit = React.useCallback(async (data: Form) => {
    const result = await signUp(data.email, data.password)
    if (result.error) {
      toast({
        title: 'Ooops...! Algo aconteceu!',
        description: result.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Faça login com sua conta!',
        description: result.message,
      })
    }
  }, [toast])

  return (
    <div className="flex flex-col items-center w-[100%] min-h-[100vh]">
      <Card className="w-[100%]">
        <CardHeader>
          <CardTitle>Finanças</CardTitle>
          <CardDescription>Gerencie suas finanças</CardDescription>
        </CardHeader>
      </Card>
      <div className="w-[65%] h-[375px] mt-24">
        <Card className="flex flex-col gap-4 justify-center px-8 py-4 ">
          <CardHeader>
            <CardTitle>Faça sua conta</CardTitle>
            <CardDescription>Entre com seus dados</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3.5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="font-semibold">E-mail</Label>
                <Input {...register('email')} id="email" placeholder="Ex. john@email.com" />
                <FormMessageError message={errors.email?.message} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="font-semibold">Senha</Label>
                <Input {...register('password')} id="password" placeholder="********" />
                <FormMessageError message={errors.password?.message} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Button className="font-semibold">Criar a conta</Button>
                <Button variant='outline' className="font-semibold">Já tenho uma conta</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
