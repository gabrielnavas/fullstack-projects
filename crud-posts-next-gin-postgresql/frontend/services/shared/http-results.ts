import { Result } from "./types";

export const httpUnauthorized = <T>(): Result<T> => {
  return {
    error: true,
    isNotAuthorized: true,
    message: 'You are not authorized.',
  }
}