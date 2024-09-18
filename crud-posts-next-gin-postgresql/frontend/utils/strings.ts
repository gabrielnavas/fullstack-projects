export const capitalizeText = (text: string) => {
  const lastLetter = text[text.length-1]
  const firstLetter = text[0]
  const mid = text.substring(1, text.length-1)
  return `${firstLetter.toUpperCase()}${mid}${
    lastLetter !== '.' 
    ? lastLetter + '.'  
    : '.'}`
}