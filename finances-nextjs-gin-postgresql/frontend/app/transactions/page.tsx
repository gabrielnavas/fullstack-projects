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
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";

import { FormMessageError } from "@/components/form/form-message-error";
import { Form } from "@/components/ui/form";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/strings";
import { TransactionContext, TransactionContextType } from "@/context/transaction-context";

const amountSchema = z.preprocess(value => {
  if (typeof value === 'string') {
    // const globalAnyDot = /\./g
    // const decimalComma = ','
    // const normalizedValue = value.replace(globalAnyDot, '').replace(decimalComma, '.');
    const formatedCurrency = parseCurrencyToDecimal(value, 'en-US')
    return formatedCurrency;
  }
  return 0; // Caso não seja string, retorna 0
},
  z.number({
    required_error: 'O valor é requerido.',
  }).max(999_999_999.99, 'O valor máximo é de 999.999.999,00')
    .min(0.01, { message: "O valor deve ser no mínimo 0.01" })
)

const formSchema = z.object({
  amount: amountSchema,
  description: z.string()
    .min(5, 'A descrição deve ter mínimo 5 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  typeTransactionName: z.string().min(1, 'Selecione o tipo de transação'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
});

type Form = z.infer<typeof formSchema>

const TransactionsPage: FC = () => {
  const [formattedAmount, setformattedAmount] = useState('0.00')

  const {
    typeTransactionNames,
    categories,
    handleFindCategories,
    handleInsertTransaction,
  } = useContext(TransactionContext) as TransactionContextType

  const { toast } = useToast()


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
      amount: 0
    }
  })

  // find categories
  useEffect(() => {
    const sub = watch(({ typeTransactionName }, { name }) => {
      if (name === 'typeTransactionName') {
        setValue('categoryId', '')
        handleFindCategories(typeTransactionName!)
      }
    })

    return () => {
      sub.unsubscribe()
    }

  }, [handleFindCategories, toast, watch, categories.length, typeTransactionNames, setValue])

  const handleAmountChange = useCallback((inputValue: string) => {
    const formattedValue = formatCurrency(inputValue, 'pt-BR');
    setformattedAmount(formattedValue);

    const numericValue = parseCurrencyToDecimal(inputValue, 'en-US')

    if (!isNaN(numericValue)) {
      setValue('amount', numericValue);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<Form> = useCallback(async data => {
    const success = await handleInsertTransaction({
      amount: Number(data.amount),
      categoryId: data.categoryId,
      description: data.description,
      typeTransactionName: data.typeTransactionName
    })
    if (success) {
      handleAmountChange('0')
      setValue('typeTransactionName', typeTransactionNames[0].name)
      setValue('description', '')
    }
  }, [handleInsertTransaction, handleAmountChange, setValue, typeTransactionNames])

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
              onChange={e => handleAmountChange(e.target.value)}
              value={formattedAmount}
              type="text" // Define como texto para aceitar a máscara
            />
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