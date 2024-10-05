import { TypeTransactionName } from "./models"
import { ServiceResult } from "./service-result"
import { addParamsToUrl } from "@/lib/url"

const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/transactions/analytics/sumAmountGroupByCategory`

export type SumAmountGroupByCategoryParams = {
  typeTransactionName?: TypeTransactionName | undefined
  createdAtFrom?: Date
  createdAtTo?: Date
}

export type SumAmountGroupByCategoryResult = {
  categoryName: string
  sum: number
}

export const sumAmountGroupByCategory = (token: string) => {
  return async (
    params: SumAmountGroupByCategoryParams,
  ): Promise<ServiceResult<SumAmountGroupByCategoryResult[] | undefined>> => {

    // find transactions
    const urlWithParams = addParamsToUrl(url, params)
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    })

    if (response.status === 401 || response.status === 403) {
      return {
        isUnauthorized: true,
        error: true,
        message: 'Sua sessão expirou.'
      }
    }

    const body = await response.json()
    
    if (!response.ok) {
      return {
        error: true,
        message: body.message,
      }
    }

    const items = body.data.map(item => ({
      categoryName: item.categoryName,
      sum: item.sum
    }) as SumAmountGroupByCategoryResult)

    return {
      error: false,
      data: items
    }
  }
}