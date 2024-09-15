import { Product } from "@/services/products/product";

export const map = (product: any): Product => {
  return {
    id: product.id,
    description: product.description,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    createdAt: new Date(product.created_at),
    updatedAt: product.updated_at ? new Date(product.updated_at) : null
  }
}