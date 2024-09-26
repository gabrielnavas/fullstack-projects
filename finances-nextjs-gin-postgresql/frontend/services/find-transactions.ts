import { filterTypeTransactionById, findTypeTransactions } from "./find-type-transactions"
import { Transaction, TypeTransaction } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export const findTransactions = (token: string) => {
  const findTypeTransactionsTokenized = findTypeTransactions(token)

  return async (): Promise<ServiceResult<Transaction[]>> => {
    // find type transactions
    const resultTypeTransactions = await findTypeTransactionsTokenized()
    if (resultTypeTransactions.error || typeof resultTypeTransactions.data !== 'object'
      || resultTypeTransactions.data?.length === 0) {
        return {
          error: true,
          message: 'Houve um problema. Tente novamente mais tarde',
        }
    }
    const typeTransactions = resultTypeTransactions.data as TypeTransaction[]

    // find transactions
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

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