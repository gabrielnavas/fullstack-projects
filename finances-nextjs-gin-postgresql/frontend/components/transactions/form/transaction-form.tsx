'use client'

import React from "react"

import {
  Controller,
  SubmitHandler,
  useForm
} from "react-hook-form"
import {
  zodResolver

} from "@hookform/resolvers/zod"

import {
  DollarSign,
  MoveDown,
  MoveUp,
  Pen,
  Plus

} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { FormMessageError } from "@/components/form/form-message-error"
import { amountConvertToNumeric, formatCurrency } from "@/lib/strings"
import {
  TransactionContext,
  TransactionContextType
} from "@/context/transaction-context"
import { FormSchema, formSchema } from "./transaction-form-schema"
import { Transaction, TypeTransactionName } from "@/services/models"
import { Label } from "@/components/ui/label"

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"

const initialFormValues = {
  formattedAmount: 'R$ 0,00',
  typeTransactionName: 'income' as TypeTransactionName,
}

type Props = {
  transaction?: Transaction | undefined
  afterFinishesOrCancel?: () => void
}

export const TransactionsFormDialog: React.FC<Props> = ({
  transaction,
  afterFinishesOrCancel
}) => {
  const [formattedAmount, setformattedAmount] = React.useState<string>("")
  const [dialogOpened, setDialogOpened] = React.useState(false)

  const isUpdate = transaction !== undefined

  const {
    typeTransactions,
    categoriasByTypeTransactions,
    handleFindCategoriesByTypeTransactionName,
    handleInsertTransaction,
    handleUpdateTransaction,
  } = React.useContext(TransactionContext) as TransactionContextType

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

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // find categories by type transaction name
  React.useEffect(() => {
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

  // init form to insert or update
  React.useEffect(() => {
    reset()
    if (isUpdate) {
      const valueFormatted = formatCurrency(transaction.amount.toString(), 'pt-BR')
      setformattedAmount(valueFormatted)
      setValue('amount', transaction.amount, { shouldValidate: true })
      setValue('typeTransactionName', transaction.typeTransaction.name,
        { shouldValidate: true })
      setValue('categoryId', transaction.categoryId, { shouldValidate: true })
      setValue('description', transaction.description, { shouldValidate: true })
    } else {
      setformattedAmount(initialFormValues.formattedAmount)
    }
  }, [dialogOpened, reset, isUpdate, transaction, setValue])

  const handleAmountChange = React.useCallback((inputValue: string) => {
    const { formattedValue, numericValue } = amountConvertToNumeric(
      inputValue,
      'pt-BR',
      'en-US'
    )
    setformattedAmount(formattedValue)
    setValue('amount', numericValue, {
      shouldValidate: true
    })
  }, [setValue])

  const insertTransactionOnSubmit: SubmitHandler<FormSchema> = React.useCallback(async data => {
    const success = await handleInsertTransaction({
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      typeTransactionName: data.typeTransactionName
    })
    if (success) {
      setDialogOpened(false)
    }
  }, [handleInsertTransaction])

  const updateTransactionOnSubmit: SubmitHandler<FormSchema> = React.useCallback(async data => {
    if (!transaction) {
      return
    }

    const success = await handleUpdateTransaction(transaction.id, {
      amount: data.amount,
      typeTransactionName: data.typeTransactionName,
      categoryId: data.categoryId,
      description: data.description,
    })
    if (success) {
      setDialogOpened(false)
      afterFinishesOrCancel!()
    }
  }, [transaction, handleUpdateTransaction, afterFinishesOrCancel])

  return (
    <Dialog open={dialogOpened} onOpenChange={open => setDialogOpened(open)}>
      <DialogTrigger asChild>
        {
          isUpdate ? (
            <Button
              className="bg-yellow-500 text-white font-semibold"
              variant='outline'>
              <Pen />
              <span>Atualizar</span>
            </Button>
          ) : (
            <Button className="px-6 gap-2 w-[200px]">
              <Plus />
              <span>Nova transação</span>
            </Button>
          )
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>
            {" Entre com os dados da nova trasação"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={
            isUpdate
              ? handleSubmit(updateTransactionOnSubmit)
              : handleSubmit(insertTransactionOnSubmit)
          } className="h-[450px] flex flex-col gap-4" >
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Valor *</Label>
              <Input
                {...register('amount')}
                ref={(e) => {
                  // pegar a referência do input e registrar a referência no react hook form
                  register('amount').ref(e)
                  inputRef.current = e
                }}
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
              {isUpdate ?
                (
                  <Button
                    className="px-6 gap-2 w-[200px] bg-yellow-500 text-white font-semibold"
                    variant='outline'>
                    <Pen />
                    <span>Atualizar</span>
                  </Button>
                ) : (
                  <Button className="px-6 gap-2 w-[200px]">
                    <Plus />
                    <span>Nova transação</span>
                  </Button>
                )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
