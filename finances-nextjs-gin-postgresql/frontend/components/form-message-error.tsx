export const FormMessageError = ({ message }: { message?: string }) => (
  message ? <div className="text-red-500 font-medium">{message}</div> : null
)