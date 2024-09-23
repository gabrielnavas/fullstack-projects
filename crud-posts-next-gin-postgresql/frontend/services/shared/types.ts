export type Result<T> = {
  isNotAuthorized?: boolean
  error: boolean
  message: string
  data?: T
}

