export const humanizeMessage = (message: string): string => {
  let finalMessage = ''
  if(message[message.length - 1] !== '.') {
    finalMessage = `${message}.`
  }
  const firstLetter = finalMessage[0].toLocaleUpperCase()
  const rest = finalMessage.substring(1, finalMessage.length)
  finalMessage = `${firstLetter}${rest}`;
  return finalMessage;
}

export const getCurrency = () => {
  const language = getLanguage()

  if (language === 'pt-BR') {
    return 'BRL';
  }

  const defaultCurrency = 'USD'

  return defaultCurrency;
}

export const getLanguage = () => {
  return navigator.language;
}