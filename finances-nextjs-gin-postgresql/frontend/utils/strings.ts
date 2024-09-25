export const formatMessage = (message: string) => {
  const firstLetter = message[0].toUpperCase()

  const middle = message.substring(1, message.length - 1)

  let lastLetter = message[message.length - 1]
  if (lastLetter !== '.') {
    lastLetter = `${lastLetter}.`
  }
  const finalStr = `${firstLetter}${middle}${lastLetter}`
  return finalStr
}

type FormatCurrencyIntl = 'en-US' | 'pt-BR'

export const formatCurrency = (value: string, intl: FormatCurrencyIntl = 'en-US'): string => {
  // Remove qualquer caractere que não seja número
  const onlyDigits = value.replace(/\D/g, '')

  if (intl === 'en-US') {
    // Remove qualquer caractere que não seja número
    const onlyDigits = value.replace(/\D/g, '');

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
  const cleanedValue = value.replace(/[^\d.,]/g, '');

  if (intlParseTo === 'en-US') {
    const globalAnyDot = /\./g
    const decimalComma = ','
    const lessDot = cleanedValue.replace(globalAnyDot, '')
    const valueLessDotAndComma = lessDot.replace(decimalComma, '.')

    return Number(valueLessDotAndComma);
  }

  return 0
}

