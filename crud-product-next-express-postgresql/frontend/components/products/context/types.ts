import { CreateProduct } from "@/services/products/create-product"
import { Product } from "@/services/products/product"
import { UpdateProduct } from "@/services/products/update-product"

export type Table = {
  data: Product[]
  totalItems: number
  totalPages: number
  page: number
  size: number
  query: string
  isEmpty: boolean
  isLoading: boolean
}

export type TableContextType = {
  table: Table
  sizeOptions: number[]
  handleAddProduct: (product: CreateProduct, image: File | null) => Promise<boolean>
  handleUpdateProduct: (productId: string, product: UpdateProduct, image: File | null) => Promise<boolean>
  handleDeleteProduct: (product: Product) => Promise<boolean>
  handleSetSize: (size: number) => void
  handleSetPageMinus: (size: number) => void
  handleSetPagePlus: (size: number) => void
  refresh: () => Promise<void>,
  handleUpdateInputSearch: (value: string) => void
}
