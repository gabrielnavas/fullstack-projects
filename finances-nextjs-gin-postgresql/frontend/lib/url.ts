import { formattedDate } from "./date";

type Params = Record<string, string | number | Date>;

export const addParamsToUrl = (endpointUrl: string, params: Params): string => {
  const queryParams = Object.entries(params)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const dateValue = typeof value !== 'number'
        && typeof value !== 'string'
        && typeof value.getMonth === 'function'
        && new Date(value)
      const dateValueStr = dateValue && formattedDate(dateValue, '-')

      const valueURI: string | number = dateValueStr
        ? dateValueStr
        : value as string | number

      const param = `${encodeURIComponent(key)}=${encodeURIComponent(valueURI)}`
      return param
    })
    .join('&');

  return queryParams
    ? `${endpointUrl}?${queryParams}`
    : endpointUrl;
}