export const FormMessageError = ({ message }: { message?: string }) => (
  message ? <div className="text-red-500 font-medium mt-1">{message}</div> : null
)