import { FC } from "react";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { DollarSign, MoveDown, MoveUp, Search } from "lucide-react";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { TransactionContext, TransactionContextType } from "@/context/transaction-context";
import { TypeTransactionName } from "@/services/models";
import { formatCurrency, parseCurrencyToDecimal } from "@/lib/strings";
import { FormMessageError } from "@/components/form/form-message-error";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSearchSchema, formSearchSchema } from "./transaction-search-schema";



export const TransactionSearchForm: FC = () => {
  const [formattedAmountMin, setFormattedAmountMin] = useState('R$ 0,00')
  const [formattedAmountMax, setFormattedAmountMax] = useState('R$ 0,00')

  const {
    typeTransactions,
    categoriasByTypeTransactions,
    handleFindCategoriesByTypeTransactionName
  } = useContext(TransactionContext) as TransactionContextType

  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
    handleSubmit
  } = useForm<FormSearchSchema>({
    resolver: zodResolver(formSearchSchema),
    defaultValues: {
      typeTransactionName: 'income' as TypeTransactionName,
    }
  })

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  // find categories by type transaction name
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


  const handleAmountMaxChange = useCallback(async (inputValue: string, amountType: 'min' | 'max') => {
    if(amountType === 'min') {
      const formattedValue = formatCurrency(inputValue, 'pt-BR');
      setFormattedAmountMin(formattedValue);
  
      const numericValue = parseCurrencyToDecimal(formattedValue, 'en-US')
      if (!isNaN(numericValue)) {
        setValue('amountMin', numericValue, {
          shouldValidate: true,
         
        })
      }
    } else if(amountType === 'max') {
      const formattedValue = formatCurrency(inputValue, 'pt-BR');
      setFormattedAmountMax(formattedValue);
  
      const numericValue = parseCurrencyToDecimal(formattedValue, 'en-US')
      if (!isNaN(numericValue)) {
        setValue('amountMax', numericValue, {
          shouldValidate: true,
         
        })
      }
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<FormSearchSchema> = useCallback(async data => {
    debugger
    console.log(data);
  }, [])
  
  return (
       
      <form
      className="flex flex-col gap-2 w-[100%]"
      onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Textarea
          {...register('description')}
          ref={(e) => {
            register('description').ref(e);
            inputRef.current = e;
          }}
          className="max-h-[50px] min-h-[50px]"
          placeholder="Descrição da transação" />
        <FormMessageError message={errors.description?.message} />
      </div>

      <div className="flex gap-2 w-[100%]">
        <div>
          <Input
            {...register('amountMin')}
            onChange={e => handleAmountMaxChange(e.target.value, 'min')}
            value={formattedAmountMin}
            type="text" // Define como texto para aceitar a máscara
          />
          <FormMessageError message={errors.amountMin?.message} />
        </div>

        <div>
          <Input
            {...register('amountMax')}
            onChange={e => handleAmountMaxChange(e.target.value, 'max')}
            value={formattedAmountMax}
            type="text" // Define como texto para aceitar a máscara
          />
          <FormMessageError message={errors.amountMax?.message} />
        </div>

        <div>
          <Controller
            name="typeTransactionName"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[130px]">
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

        <div>
          <Controller
            name="categoryId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Categoria" />
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

        <Button className="px-6 gap-2">
          <Search />
          <span>Buscar</span>
        </Button>
      </div>
    </form >
    );
}
