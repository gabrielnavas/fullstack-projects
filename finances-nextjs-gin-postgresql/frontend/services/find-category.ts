import { filterTypeTransactionById, findTypeTransactions } from "./find-type-transactions"
import { Category } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/categories?typeName=`

export const findCategoriesByTypeTransaction = (token: string) => {
  return async (typeTransaction: string): Promise<ServiceResult<Category[]>> => {
    const fullUrl = `${url}${typeTransaction}`

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    const body = await response.json()

    if (!response.ok || typeof body.data !== 'object' || body.data.length === 0) {
      return {
        error: true,
        message: body.message,
      }
    }

    // find typetransactions
    const resultTypeTransactions = await findTypeTransactions(token)()
    if (resultTypeTransactions.error || typeof resultTypeTransactions.data !== 'object'
      || resultTypeTransactions.data?.length === 0) {
      return {
        error: true,
        message: 'Houve um problema. Tente novamente mais tarde',
      }
    }

    const typeTransactions = resultTypeTransactions.data

    const categories = body.data.map(category => {
      const typeTransaction = filterTypeTransactionById(
        category.typeTransactionId,
        typeTransactions
      )
      return {
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: new Date(category.createdAt),
        updatedAt: category.updatedAt ? new Date(category.updatedAt) : null,
        typeTransaction: typeTransaction
      } as Category
    })

    return {
      message: body.message,
      error: !response.ok,
      data: categories
    }
  }
}

export const getCategoryNameById = (id: string, categories: Category[]) => {
  const category = categories.find(category => category.id === id)
  if (category !== undefined) {
    return category.name
  }
  return ''
}