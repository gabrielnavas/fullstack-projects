export type ServiceResult<T> = {
  error: boolean
  message: string
  data?: T
}
