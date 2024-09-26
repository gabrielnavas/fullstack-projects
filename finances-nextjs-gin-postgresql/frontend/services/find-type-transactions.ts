import { TypeTransaction } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/type-transactions`

export const findTypeTransactions = (token: string) => {
  return async (): Promise<ServiceResult<TypeTransaction[]>> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    const json = await response.json()

    return {
      error: !response.ok,
      message: json.message,
      data: json.data,
    }
  }
}