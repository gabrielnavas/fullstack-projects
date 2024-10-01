export const formatMessage = (message: string) => {
  if (!message || message.length === 0) {
    return ''
  }
  const firstLetter = message[0].toUpperCase()

  const middle = message.substring(1, message.length - 1)

  let lastLetter = message[message.length - 1]
  if (lastLetter !== '.') {
    lastLetter = `${lastLetter}.`
  }
  const finalStr = `${firstLetter}${middle}${lastLetter}`
  return finalStr
}

// Remove qualquer caractere que não seja número
export const removeNonDigits = (value: string) => value.replace(/\D/g, '')
export const removeNonDigitDotComma = (value: string) => value.replace(/[^\d.,]/g, '');

type FormatCurrencyKey = 'en-US' | 'pt-BR'
type FormatCurrencyValue = 'USD' | 'BRL'
const currencies: Record<FormatCurrencyKey, FormatCurrencyValue> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
}

export const formatCurrency = (value: string, intl: FormatCurrencyKey = 'en-US'): string => {
  const onlyDigits = removeNonDigits(value);
  const hasCents = [',', '.'].some(item => value.includes(item))
 
  const numericValue = parseFloat(onlyDigits);
  const finalValue = hasCents ?  numericValue / 100 : numericValue;

  const formattedValue = new Intl.NumberFormat(intl, {
    style: 'currency',
    currency: currencies[intl],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalValue);

  return formattedValue;
}

export const parseCurrencyToDecimal = (value: string, intlParseTo: FormatCurrencyKey = 'en-US'): number => {
  // Remove qualquer caractere que não seja número, . e ,
  const cleanedValue = removeNonDigitDotComma(value)

  if (intlParseTo === 'en-US') {
    const globalAnyDot = /\./g
    const decimalComma = ','
    const lessDot = cleanedValue.replace(globalAnyDot, '')
    const valueLessDotAndComma = lessDot.replace(decimalComma, '.')

    return Number(valueLessDotAndComma);
  }

  return 0
}

export const amountConvertToNumeric = (
  inputValue: string,
  formattedValueIntl: FormatCurrencyKey,
  numericValueIntl: FormatCurrencyKey,
) => {
  const formattedValue = formatCurrency(inputValue, formattedValueIntl);
  const numericValue = parseCurrencyToDecimal(formattedValue, numericValueIntl)
  return {
    formattedValue,
    numericValue: !isNaN(numericValue) ? numericValue : 0
  }
} 