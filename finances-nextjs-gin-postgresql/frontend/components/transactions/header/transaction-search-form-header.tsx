import React from "react";

import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import {
  DollarSign,
  MoveDown,
  MoveUp,
  Search
} from "lucide-react";

import { subDays } from "date-fns";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  TransactionContext,
  TransactionContextType
} from "@/context/transaction-context";

import { TypeTransactionName } from "@/services/models";

import { amountConvertToNumeric } from "@/lib/strings";

import { FormMessageError } from "@/components/form/form-message-error";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormSearchSchema,
  formSearchSchema
} from "@/components/transactions/header/transaction-search-schema";
import { Label } from "@/components/ui/label";
import { CollapsibleSearchForm } from "@/components/transactions/header/transaction-search-form-colapsible";
import { DatePickerRange, DatePickerWithRange } from "@/components/form/date-picker";

export const TransactionSearchForm: React.FC = () => {

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
    reset,
    control,
    formState: { errors },
    handleSubmit
  } = useForm<FormSearchSchema>({
    resolver: zodResolver(formSearchSchema),
    defaultValues: {
      createdAt: {
        from: subDays(new Date(), 15),
        to: new Date(),
      }
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

    return () => sub.unsubscribe()
  }, [handleFindCategoriesByTypeTransactionName, watch, setValue])

  const handleAmountChange = useCallback((
    inputValue: string,
    inputType: 'min' | 'max',
  ) => {
    if (inputType === 'min') {
      const { formattedValue, numericValue } = amountConvertToNumeric(
        inputValue,
        'pt-BR', 'en-US'
      )
      setFormattedAmountMin(formattedValue)
      setValue('amountMin', numericValue)

    } else if (inputType === 'max') {
      const { formattedValue, numericValue } = amountConvertToNumeric(
        inputValue,
        'pt-BR', 'en-US'
      )
      setFormattedAmountMax(formattedValue)
      setValue('amountMax', numericValue)
    } else {
      throw new Error('input type not found')
    }
  }, [setValue])

  const onSubmit: SubmitHandler<FormSearchSchema> = useCallback(
    async data => {
      await handleFindTransactions({
        amountMin: data.amountMin,
        amountMax: data.amountMax,
        description: data.description,
        categoryId: data.categoryId === 'selecione'
          ? undefined
          : data.categoryId,
        typeTransactionName: data.typeTransactionName === 'selecione'
          ? undefined
          : data.typeTransactionName as TypeTransactionName,
        createdAtFrom: data.createdAt?.from,
        createdAtTo: data.createdAt?.to,
      })
    },
    [handleFindTransactions]
  )

  const handleResetForm = useCallback(() => {
    reset()
    handleFindTransactions({})
  }, [handleFindTransactions, reset])

  const handleGetCreatedAtRangeDate = useCallback((date?: DatePickerRange) => {
    debugger
    setValue('createdAt', {
      from: date?.from,
      to: date?.to,
    })
  }, [setValue])

  return (
    <CollapsibleSearchForm reset={handleResetForm}>
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
              <Label>Valor Mínimo</Label>
              <Input
                className="w-[250px]"
                {...register('amountMin')}
                onChange={e => handleAmountChange(e.target.value, 'min')}
                value={formattedAmountMin}
                type="text"
              />
              <FormMessageError message={errors.amountMin?.message} />
            </div>
            <div>
              <Label>Valor Máximo</Label>
              <Input
                {...register('amountMax')}
                onChange={e => handleAmountChange(e.target.value, 'max')}
                value={formattedAmountMax}
                type="text"
              />
              <FormMessageError message={errors.amountMax?.message} />
            </div>
          </div>
          <div className="flex justify-between ">
            <div className="flex gap-2">
              <div>
                <Label>Tipo da transação</Label>
                <Controller
                  name="typeTransactionName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          key={0}
                          value={'selecione'}>
                          {'Nenhum'}
                        </SelectItem>
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
                <Label>Categoria</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          key={0}
                          value={'selecione'}>
                          {'Nenhuma'}
                        </SelectItem>
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
            </div>
          </div>
          <div className="flex">
            <div className="flex items-end justify-between w-[100%] gap-2">
              <div>
                <Label>Intervalo de criação</Label>
                <Controller
                  name="createdAt"
                  control={control}
                  render={({ field }) => (
                    <DatePickerWithRange
                      getRangeDate={handleGetCreatedAtRangeDate}
                      date={{
                        from: field.value.from!,
                        to: field.value.to!
                      }}
                      title="Selecione o intervalo"
                    />
                  )} />
              </div>
              <Button className="px-6 gap-2 w-[200px]">
                <Search />
                <span>Buscar</span>
              </Button>
            </div>
          </div>
        </div>
      </form >
    </CollapsibleSearchForm>
  );
}
