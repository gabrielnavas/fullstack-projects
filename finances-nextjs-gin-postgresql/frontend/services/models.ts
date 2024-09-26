export type User = {
  id: string
  fullname: string
  email: string
  createdAt: Date
  updatedAt: Date | null
}

export type TypeTransactionName = 'income' | 'expense'
export type TypeTransactionDisplay = 'Renda' | 'Despesa'

export type TypeTransaction = {
  id: string
  name: TypeTransactionName
  displayName: TypeTransactionDisplay
}

export type Category = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date | null
  typeTransaction: TypeTransaction
}

export type Transaction = {
  id: string
  amount: number
  typeTransaction: TypeTransaction
  userId: string
  categoryId: string
  description: string
  createdAt: Date
  updatedAt: Date | null
}