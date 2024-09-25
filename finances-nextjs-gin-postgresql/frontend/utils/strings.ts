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