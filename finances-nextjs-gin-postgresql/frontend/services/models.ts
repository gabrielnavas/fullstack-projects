export type User = {
  id: string,
  fullname: string,
  email: string,
  createdAt: Date,
  updatedAt: Date | null,
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
  typeTransaction: TypeTransaction
}

export type Transaction = {
  id: string,
  amount: number,
  typeTransation: TypeTransaction,
  user: User,
  category: Category,
  description: string,
  createdAt: Date,
  updatedAt: Date | null,
}