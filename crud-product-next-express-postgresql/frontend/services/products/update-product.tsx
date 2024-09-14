import { humanizeMessage } from "@/utils/string"

import { Product } from "@/services/products/product"

export type UpdateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">

type Result = {
  message: string
  error: boolean
}

const updateProduct = async (productId: string, product: UpdateProduct): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/${productId}`;

  const result = await fetch(
    url, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product)
  })


  if (!result.ok) {
    const body = await result.json()
    return {
      message: humanizeMessage(body.message),
      error: true
    }
  }
  return {
    message: 'Product updated.',
    error: false
  }
}

export default updateProduct