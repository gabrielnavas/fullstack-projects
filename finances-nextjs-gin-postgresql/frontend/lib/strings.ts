export const formatMessage = (message: string) => {
  if(!message || message.length === 0) {
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
export const removeNonDigits = (value: string) =>  value.replace(/\D/g, '')
export const removeNonDigitDotComma = (value: string) => value.replace(/[^\d.,]/g, '');

type FormatCurrencyIntl = 'en-US' | 'pt-BR'

export const formatCurrency = (value: string, intl: FormatCurrencyIntl = 'en-US'): string => {
  const onlyDigits = removeNonDigits(value)

  if (intl === 'en-US') {
    // Formata o valor no padrão dos Estados Unidos
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Define a moeda como Dólar Americano
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(onlyDigits) / 100); // Divide por 100 se você estiver tratando centavos

    return formattedValue;
  }

  // Formata o valor no padrão brasileiro
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL', // Define a moeda como Dólar Americano
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(onlyDigits) / 100)
  return formattedValue
}

export const parseCurrencyToDecimal = (value: string, intlParseTo: FormatCurrencyIntl = 'en-US'): number => {
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
  formattedValueIntl: FormatCurrencyIntl, 
  numericValueIntl: FormatCurrencyIntl,
) => {
  const formattedValue = formatCurrency(inputValue, formattedValueIntl);
  const numericValue = parseCurrencyToDecimal(formattedValue, numericValueIntl)
  return {
    formattedValue,
    numericValue: !isNaN(numericValue) ? numericValue : 0
  }
} 