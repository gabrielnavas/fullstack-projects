'use client'

import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";

import { FormMessageError } from "@/components/form/form-message-error";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/strings";
import { TransactionContext, TransactionContextType } from "@/context/transaction-context";
import { FormSchema, formSchema } from "./transaction-form-schema";

const TransactionsForm: FC = () => {
  const [formattedAmount, setformattedAmount] = useState('R$ 0.00')

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

  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeTransactionName: typeTransactionNames[0].name,
      amount: 0
    }
  })

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

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

  const onSubmit: SubmitHandler<FormSchema> = useCallback(async data => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" >
      <div>
        <Label className="font-medium">Valor *</Label>
        <Input
          {...register('amount')}
          ref={(e) => {
            // pegar a referência do input e registrar a referência no react hook form
            register('amount').ref(e);
            inputRef.current = e;
          }}
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
  );
}

export default TransactionsForm