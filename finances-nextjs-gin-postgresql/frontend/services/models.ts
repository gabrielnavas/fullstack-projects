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