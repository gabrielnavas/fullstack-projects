import { Result } from "./types";

export const httpUnauthorized = <T>(): Result<T> => {
  return {
    error: true,
    iAuthorized: false,
    message: 'You are not authorized.',
  }
}