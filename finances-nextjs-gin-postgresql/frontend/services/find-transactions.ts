import { filterTypeTransactionById, findTypeTransactions } from "./find-type-transactions"
import { Transaction, TypeTransaction, TypeTransactionName } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export type FindTransactionsParams = {
  amountMin?: number | undefined
  amountMax?: number | undefined
  typeTransactionName?: TypeTransactionName | undefined
  categoryId?: string | undefined
  description?: string | undefined
}

export const findTransactions = (token: string) => {
  const findTypeTransactionsTokenized = findTypeTransactions(token)

  const addParamsToUrl = (endpointUrl: string, params: FindTransactionsParams): string => {
    let urlFinal = endpointUrl

    if (params.amountMin) {
      urlFinal = `${urlFinal}?amountMin=${params.amountMin}`
    }
    if (params.amountMax) {
      urlFinal = `${urlFinal}&amountMax=${params.amountMax}`
    }
    if (params.categoryId) {
      urlFinal = `${urlFinal}&categoryId=${params.categoryId}`
    }
    if (params.description) {
      urlFinal = `${urlFinal}&description=${params.description}`
    }
    if (params.typeTransactionName) {
      urlFinal = `${urlFinal}&typeTransactionName=${params.typeTransactionName}`
    }

    return urlFinal
  }

  return async (params: FindTransactionsParams): Promise<ServiceResult<Transaction[] | undefined>> => {
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

    if(response.status === 401 || response.status === 403) {
      return {
        isUnauthorized: true,
        error: true,
        message: 'Sua sessão expirou.'
      }
    }

    const dataTransaction = await response.json()

    if (!response.ok) {
      return {
        error: true,
        message: dataTransaction.message,
      }
    }

    const transactions = dataTransaction.data.map(transaction => {
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
      message: dataTransaction.message,
      data: transactions,
    }
  }
}