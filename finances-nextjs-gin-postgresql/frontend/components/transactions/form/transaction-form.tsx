'use client'

import { FC, useCallback, useContext, useEffect, useRef, useState } from "react"

import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DollarSign, MoveDown, MoveUp, Plus } from "lucide-react"

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

import { FormMessageError } from "@/components/form/form-message-error"
import { amountConvertToNumeric, formatCurrency } from "@/lib/strings"
import {
  TransactionContext, TransactionContextType
} from "@/context/transaction-context"
import { FormSchema, formSchema } from "./transaction-form-schema"
import { TypeTransactionName } from "@/services/models"
import { Label } from "@/components/ui/label"

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"

const initialFormValues = {
  formattedAmount: 'R$ 0,00',
  typeTransactionName: 'income' as TypeTransactionName,
}

export const TransactionsFormDialog: FC = () => {
  const [formattedAmount, setformattedAmount] = useState(initialFormValues.formattedAmount)
  const [dialogOpened, setDialogOpened] = useState(false)

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
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeTransactionName: initialFormValues.typeTransactionName
    }
  })

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
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

  const handleAmountChange = useCallback((inputValue: string) => {
    const { formattedValue, numericValue } = amountConvertToNumeric(inputValue, 'pt-BR', 'en-US')
    setformattedAmount(formattedValue)
    setValue('amount', numericValue, {
      shouldValidate: true
    })
  }, [setValue])

  const onSubmit: SubmitHandler<FormSchema> = useCallback(async data => {
    const { message, success } = await handleInsertTransaction({
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      typeTransactionName: data.typeTransactionName
    })
    if (success) {
      handleAmountChange(initialFormValues.formattedAmount)
      setValue('typeTransactionName', 'income' as TypeTransactionName,)
      setValue('description', '')
      toast({
        title: "Sucesso!",
        description: message
      })
      setDialogOpened(false)
    } else {
      toast({
        title: message,
      })
    }
  }, [toast, handleInsertTransaction, handleAmountChange, setValue])

  const resetForm = useCallback(() => {
    reset()
    const formattedValue = formatCurrency(initialFormValues.formattedAmount, 'pt-BR');
    setformattedAmount(formattedValue)
  }, [reset])

  const handleOpenModal = useCallback((opened: boolean) => {
    if (opened === false) {
      resetForm()
    }
    setDialogOpened(opened)
  }, [resetForm])

  return (
    <Dialog open={dialogOpened} onOpenChange={handleOpenModal}>
      <DialogTrigger asChild>
        <Button className="px-6 gap-2 w-[200px]">
          <Plus />
          <span>Nova transação</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>
            {" Entre com os dados da nova trasação"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="h-[450px] flex flex-col gap-4" >
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Valor *</Label>
              <Input
                {...register('amount')}
                // ref={(e) => {
                //   // pegar a referência do input e registrar a referência no react hook form
                //   register('amount').ref(e)
                //   inputRef.current = e
                // }}
                onChange={e => handleAmountChange(e.target.value)}
                value={formattedAmount}
                type="text" // Define como texto para aceitar a máscara
              />
              <FormMessageError message={errors.amount?.message} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Tipo da Transação</Label>
              <Controller
                name="typeTransactionName"
                control={control}
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

            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Categoria</Label>
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

            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Descrição *</Label>
              <Textarea
                className="min-h-[80px] max-h-[80px]"
                {...register('description')} />
              <FormMessageError message={errors.description?.message} />
            </div>
            <div>
              <Button className="px-10 font-medium">
                Inserir
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
