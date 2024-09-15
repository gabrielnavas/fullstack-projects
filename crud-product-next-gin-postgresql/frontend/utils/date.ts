import moment from "moment"

export const fromNow = (date: Date): string => {
  return moment(date, "YYYYMMDD").fromNow()
}