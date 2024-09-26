import { Category } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/categories?typeName=`

export const findCategories = (token: string) => {
  return async (typeName: string): Promise<ServiceResult<Category[]>> => {
    const fullUrl = `${url}${typeName}`
  
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const body = await response.json()
      return {
          message: body.message,
          error: !response.ok,
          data: body.data.map((category: Category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            createdAt: new Date(category.createdAt),
            updatedAt: category.updatedAt ? new Date(category.updatedAt) : null,
            typeTransactionId: category.typeTransactionId,
          }) as Category)
      }
    }
    catch {
      return {
        message: 'error! call the admin',
        error: true
      }
    }
  }
}