'use client'

import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DollarSign, MoveDown, MoveUp } from "lucide-react";


import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { FormMessageError } from "@/components/form/form-message-error";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/strings";
import {
  TransactionContext, TransactionContextType
} from "@/context/transaction-context";
import { FormSchema, formSchema } from "./transaction-form-schema";
import { TypeTransactionName } from "@/services/models";
import { Label } from "@/components/ui/label";

const TransactionsForm: FC = () => {
  const [formattedAmount, setformattedAmount] = useState('R$ 0.00')

  const {
    typeTransactions,
    categoriasByTypeTransactions,
    handleFindCategoriesByTypeTransactionName,
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
      typeTransactionName: 'income' as TypeTransactionName,
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
        handleFindCategoriesByTypeTransactionName(typeTransactionName!)
      }
    })

    return () => {
      sub.unsubscribe()
    }

  }, [handleFindCategoriesByTypeTransactionName, watch, setValue])

  const handleAmountChange = useCallback((inputValue: string) => {
    const formattedValue = formatCurrency(inputValue, 'pt-BR');
    setformattedAmount(formattedValue);

    const numericValue = parseCurrencyToDecimal(inputValue, 'en-US')

    if (!isNaN(numericValue)) {
      setValue('amount', numericValue);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<FormSchema> = useCallback(async data => {
    const { message, success } = await handleInsertTransaction({
      amount: Number(data.amount),
      categoryId: data.categoryId,
      description: data.description,
      typeTransactionName: data.typeTransactionName
    })
    if (success) {
      handleAmountChange('0')
      setValue('typeTransactionName', 'income' as TypeTransactionName,)
      setValue('description', '')
      toast({
        title: "Sucesso!",
        description: message
      })

    } else {
      toast({
        title: message,
      })
    }
  }, [toast, handleInsertTransaction, handleAmountChange, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" >
      <div className="flex flex-col gap-1">
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

      <div className="flex flex-col gap-1">
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
                {typeTransactions.map(item => (
                  <SelectItem
                    key={item.name}
                    value={item.name}>
                    <div className="flex items-center">
                      <DollarSign color="gray" size={17} />
                      {
                        item.name === 'income'
                          ? <MoveUp size={17} color="green" />
                          : <MoveDown color="red" />
                      }
                      {item.displayName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
        <FormMessageError message={errors.typeTransactionName?.message} />
      </div>

      <div className="flex flex-col gap-1">
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
                {categoriasByTypeTransactions.map(category => (
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

      <div className="flex flex-col gap-1">
        <Label className="font-medium">Descrição *</Label>
        <Textarea
          className="min-h-[80px] max-h-[80px]"
          {...register('description')} />
        <FormMessageError message={errors.description?.message} />
      </div>
      <Button className="px-10 font-medium">
        Inserir
      </Button>
    </form>
  );
}

export default TransactionsForm