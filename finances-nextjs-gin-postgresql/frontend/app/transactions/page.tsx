'use client'
import { FC, useCallback, useContext, useEffect, useState } from "react";

import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext, AuthContextType } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { findCategories } from "@/services/find-category";
import { Category } from "@/services/models";
import { Label } from "@radix-ui/react-label";

import { FormMessageError } from "@/components/form-message-error";
import { insertTransaction } from "@/services/insert-transaction";


const formSchema = z.object({
  amount: z.preprocess(
    (v) => parseFloat(v as string),
    z.number().min(0.01, { message: "O valor deve ser no mínimo 0.01" })
  ),
  description: z.string()
    .min(10, 'A descrição deve ter mínimo 10 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  typeTransactionName: z.string().min(1, 'Selecione o tipo de transação'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
});

type Form = z.infer<typeof formSchema>

const TransactionsPage: FC = () => {
  const { token } = useContext(AuthContext) as AuthContextType

  const [categories, setCategories] = useState<Category[]>([])

  const { toast } = useToast()

  const [typeTransactionNames] = useState([
    { name: "income", displayName: "Renda" },
    { name: "expense", displayName: "Despesa" }
  ])

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },

  } = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeTransactionName: typeTransactionNames[0].name,
      amount: 10.00,
    }
  })

  // find categories
  useEffect(() => {
    const handleFindTypeTransactionName = async (token: string, typeTransactionName: string) => {
      if (!token || token.length === 0) {
        return
      }

      const result = await findCategories(token)(typeTransactionName!)
      if (result.data) {
        setCategories(result.data)
      } else {
        toast({
          title: "Ooops! Algo aconteceu!",
          description: result.message,
        })
      }
    }

    if (categories.length === 0) {
      handleFindTypeTransactionName(token, typeTransactionNames[0].name)
    }

    const sub = watch(({ typeTransactionName }, { name }) => {
      if (name === 'typeTransactionName') {
        setValue('categoryId', '')
        handleFindTypeTransactionName(token, typeTransactionName!)
      }
    })

    return () => {
      sub.unsubscribe()
    }

  }, [token, toast, watch, categories.length, typeTransactionNames, setValue])

  const onSubmit: SubmitHandler<Form> = useCallback(async data => {
    await insertTransaction(token)(data)
  }, [token])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova transação</CardTitle>
        <CardDescription>Entre com os dados</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" >
          <div>
            <Label className="font-medium">Valor *</Label>
            <Input
              {...register('amount')}
              // TODO: change to number
              type="number"
              step="0.01" />
            <FormMessageError message={errors.amount?.message} />
          </div>

          <div>
            <Label className="font-medium">Tipo da Transação</Label>
            <Controller
              name="typeTransactionName"
              control={control}
              defaultValue="opa"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeTransactionNames.map(item => (
                      <SelectItem
                        key={item.name}
                        value={item.name}>
                        {item.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            <FormMessageError message={errors.typeTransactionName?.message} />
          </div>

          <div>
            <Label className="font-medium">Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem
                        key={category.id}
                        value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            <FormMessageError message={errors.categoryId?.message} />
          </div>

          <div>
            <Label className="font-medium">Descrição *</Label>
            <Textarea {...register('description')} />
            <FormMessageError message={errors.description?.message} />
          </div>
          <Button className="px-10 font-medium">
            Inserir
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default TransactionsPage