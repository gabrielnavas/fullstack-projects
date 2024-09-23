export type Result<T> = {
  iAuthorized: boolean
  error: boolean
  message: string
  data?: T
}

