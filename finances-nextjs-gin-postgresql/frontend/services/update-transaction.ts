import { ServiceResult } from "./service-result"

export type UpdateTransactionParams = {
  amount: number,
  typeTransactionId: string,
  categoryId: string,
  description: string,
}

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export const updateTransaction = (token: string) =>
  async (
    transactionId: string,
    params: UpdateTransactionParams
  ): Promise<ServiceResult<void>> => {
    const urlWithParams = `${url}/${transactionId}`
    const response = await fetch(urlWithParams, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })

    if (response.status === 401 || response.status === 403) {
      return {
        error: true,
        isUnauthorized: true,
        message: "faça o login novamente"
      }
    } else if (response.status === 400) {
      const body = await response.json()
      return {
        error: true,
        message: body.message || 'algo aconteceu'
      }
    } else if (response.status === 204) {
      return {
        error: false,
        message: 'atualizado com sucesso'
      }
    }

    return {
      error: true,
      message: 'algo aconteceu'
    }
  }