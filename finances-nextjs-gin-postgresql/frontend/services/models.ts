export type User = {
  id: string
  fullname: string
  email: string
  createdAt: Date
  updatedAt: Date | null
}

export type TypeTransaction = {
  id: string
  name: string
}

export type Category = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date | null
  typeTransactionId: string
}

export type Transaction = {
  id: string
  amount: number
  typeTransactionId: string
  userId: string
  categoryId: string
  description: string
  createdAt: Date
  updatedAt: Date | null
}