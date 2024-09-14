import { map } from "@/services/products/map"

import { Product } from "@/services/products/product"

type Result = {
  data: Product[]
  totalItems: number
}

const findProducts = async (page: number, size: number, query: string): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products?page=${page}&size=${size}&query=${query}`;
  const response = await fetch(url)
  const body = await response.json()
  return {
    data: body.data.map(map),
    totalItems: body.totalItems
  }
}

export default findProducts