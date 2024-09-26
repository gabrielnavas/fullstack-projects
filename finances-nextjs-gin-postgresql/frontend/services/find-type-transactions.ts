import { TypeTransaction, TypeTransactionDisplay, TypeTransactionName } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/type-transactions`

export const findTypeTransactions = (token: string) => {
  return async (): Promise<ServiceResult<TypeTransaction[]>> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    const json = await response.json()
    
    const typeTransactions = json.data.map(typeTransaction =>  {
      const displayName =  (typeTransaction.name as TypeTransactionName) === 'expense' 
      ? 'Despesa'  as TypeTransactionDisplay
      : 'Renda' as TypeTransactionDisplay
      return {
        id: typeTransaction.id,
        name: typeTransaction.name,
        displayName: displayName
      } as TypeTransaction
    })

    return {
      error: !response.ok,
      message: json.message,
      data: typeTransactions
    }
  }
}

export const filterTypeTransactionById = (id: string, typeTransactions: TypeTransaction[]): TypeTransaction => {
  const typeTransactionsFind = typeTransactions.filter(
    typeTransaction => typeTransaction.id === id
  )
  if (typeTransactionsFind.length === 0 ) {
    throw new Error("type transactou not found")
  }
  return typeTransactionsFind[0]
}