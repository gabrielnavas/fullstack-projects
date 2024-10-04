import { ServiceResult } from "./service-result"

export type InsertTransactionParams = {
  amount: number,
  typeTransactionName: string,
  categoryId: string,
  description: string,
}

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export const insertTransaction = (token: string) =>
  async (params: InsertTransactionParams): Promise<ServiceResult<void>> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })

    const resultContent = await response.json()

    return {
      error: !response.ok,
      message: resultContent.message as string
    }
  }