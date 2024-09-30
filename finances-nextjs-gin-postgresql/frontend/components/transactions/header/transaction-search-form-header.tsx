import React, { FC } from "react";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { ChevronsUpDown, DollarSign, MoveDown, MoveUp, Search } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


export const TransactionSearchForm: FC = () => {
  const [formattedAmountMin, setFormattedAmountMin] = useState('R$ 0,00')
  const [formattedAmountMax, setFormattedAmountMax] = useState('R$ 0,00')

  const {
    typeTransactions,
    categoriasByTypeTransactions,
    handleFindCategoriesByTypeTransactionName,
    handleFindTransactions
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
    // defaultValues: {
    //   typeTransactionName: 'income' as TypeTransactionName,
    // }
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
    if (amountType === 'min') {
      const formattedValue = formatCurrency(inputValue, 'pt-BR');
      setFormattedAmountMin(formattedValue);

      const numericValue = parseCurrencyToDecimal(formattedValue, 'en-US')
      if (!isNaN(numericValue)) {
        setValue('amountMin', numericValue, {
          shouldValidate: true,

        })
      }
    } else if (amountType === 'max') {
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
    console.log(data);
    await handleFindTransactions({
      amountMin: data.amountMin,
      amountMax: data.amountMax,
      description: data.description,
      categoryId: data.categoryId,
      typeTransactionName: data.typeTransactionName as TypeTransactionName,
    })
  }, [handleFindTransactions])

  const AccordionForm = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    useEffect(() => {
      const isOpen = localStorage.getItem('transaction-form-search-open')
      setIsOpen(isOpen === 'open')
    }, [])

    const handleIsOpen = useCallback(() => {
      const state = !isOpen
      localStorage.setItem('transaction-form-search-open', state ? 'open' : 'closed')
      setIsOpen(state)
    }, [setIsOpen, isOpen])

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={handleIsOpen}
      >
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="secondary" size="sm" className="flex gap-2">
              <h4 className="text-sm font-semibold">
                {isOpen ? 'Esconder filtros' : 'Deseja filtrar as transações?'}
              </h4>
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {children}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <AccordionForm>
      <form
        className="flex flex-col gap-2 mt-4 mb-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Descrição</Label>
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

        <div className="flex flex-col gap-y-2">
          <div className="flex gap-2">
            <div>
              <Label>Valor Máximo</Label>
              <Input
                className="w-[250px]"
                {...register('amountMin')}
                onChange={e => handleAmountMaxChange(e.target.value, 'min')}
                value={formattedAmountMin}
                type="text" // Define como texto para aceitar a máscara
              />
              <FormMessageError message={errors.amountMin?.message} />
            </div>

            <div>
              <Label>Valor Mínimo</Label>
              <Input
                className="w-[250px]"
                {...register('amountMax')}
                onChange={e => handleAmountMaxChange(e.target.value, 'max')}
                value={formattedAmountMax}
                type="text" // Define como texto para aceitar a máscara
              />
              <FormMessageError message={errors.amountMax?.message} />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Controller
              name="typeTransactionName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Tipo de transação" />
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
            <Controller
              name="categoryId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[250px]">
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
          </div>
          <Button className="px-6 gap-2">
            <Search />
            <span>Buscar</span>
          </Button>
          <FormMessageError message={errors.categoryId?.message} />
        </div>
      </form >

    </AccordionForm>
  );
}
