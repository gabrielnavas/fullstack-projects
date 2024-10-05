import { filterTypeTransactionById, findTypeTransactions } from "./find-type-transactions"
import { Transaction, TypeTransaction, TypeTransactionName } from "./models"
import { ServiceResult } from "./service-result"
import { addParamsToUrl } from "@/lib/url"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export type FindTransactionsParams = {
  amountMin?: number | undefined
  amountMax?: number | undefined
  typeTransactionName?: TypeTransactionName | undefined
  categoryId?: string | undefined
  description?: string | undefined
  createdAtFrom?: Date
  createdAtTo?: Date
  page?: number
  pageSize?: number
}

export type FindTransactionsResult = {
  transactions: Transaction[]
  totalPages: number
  totalItems: number
  currentPage: number
}

export const findTransactions = (token: string) => {
  const findTypeTransactionsTokenized = findTypeTransactions(token)

  return async (
    params: FindTransactionsParams,
  ): Promise<ServiceResult<FindTransactionsResult | undefined>> => {
    // find type transactions
    const resultTypeTransactions = await findTypeTransactionsTokenized()
    if (resultTypeTransactions.error || typeof resultTypeTransactions.data !== 'object'
      || resultTypeTransactions.data?.length === 0) {
      return {
        error: true,
        message: 'Houve um problema. Tente novamente mais tarde',
      }
    }
    if (resultTypeTransactions.isUnauthorized) {
      return {
        error: resultTypeTransactions.error,
        isUnauthorized: resultTypeTransactions.isUnauthorized,
        message: resultTypeTransactions.message
      }
    }
    const typeTransactions = resultTypeTransactions.data as TypeTransaction[]

    // find transactions
    const urlWithParams = addParamsToUrl(url, params)
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    if (response.status === 401 || response.status === 403) {
      return {
        isUnauthorized: true,
        error: true,
        message: 'Sua sessão expirou.'
      }
    }

    const body = await response.json()

    if (!response.ok) {
      return {
        error: true,
        message: body.message,
      }
    }

    const transactions = body.data.transactions.map(transaction => {
      const typeTransaction = filterTypeTransactionById(
        transaction.typeTransactionId,
        typeTransactions
      )
      return {
        id: transaction.id,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        createdAt: transaction.createdAt,
        description: transaction.description,
        typeTransaction: typeTransaction,
        updatedAt: transaction.updatedAt
      } as Transaction
    })

    return {
      error: false,
      data: {
        transactions: transactions,
        currentPage: body.data.currentPage,
        totalItems: body.data.totalItems,
        totalPages: body.data.totalPages,
      }
    }
  }
}