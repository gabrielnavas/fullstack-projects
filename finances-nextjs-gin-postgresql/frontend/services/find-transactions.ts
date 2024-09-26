import { Transaction } from "./models"
import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export const findTransactions = (token: string) => {
  return async (): Promise<ServiceResult<Transaction[]>> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    const json = await response.json()

    return {
      error: response.ok,
      message: json.message,
      data: json.data,
    }
  }
}