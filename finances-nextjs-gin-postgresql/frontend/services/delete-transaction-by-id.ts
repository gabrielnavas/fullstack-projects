import { ServiceResult } from "./service-result"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions`

export const deleteTransactionById = (token) =>
  async (transactionId: string): Promise<ServiceResult<void>> => {
    const urlWithParam = `${url}/${transactionId}`
    const response = await fetch(urlWithParam, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
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
        message: 'removido com sucesso'
      }
    }

    return {
      error: true,
      message: 'algo aconteceu'
    }
  }