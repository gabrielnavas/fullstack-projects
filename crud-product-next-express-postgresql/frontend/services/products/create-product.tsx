import { humanizeMessage } from "@/utils/string"

import { map } from "@/services/products/map"

import { Product } from "@/services/products/product"

export type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">

type Result = {
  data: Product | null
  message: string
  error: boolean
}

const createProduct = async (product: CreateProduct): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products`;
  const response = await fetch(
    url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product)
  })
  const body = await response.json()
  return {
    data: response.ok ? map(body.data) : null,
    error: !response.ok,
    message: humanizeMessage(body.message),
  }
}

export default createProduct