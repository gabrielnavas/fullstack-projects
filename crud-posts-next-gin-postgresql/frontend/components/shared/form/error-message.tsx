import { FC } from "react";
interface IErrorMessageProps {
  message?: string | undefined
};

export const ErrorMessage: FC<IErrorMessageProps> = ({
  message
}) => {
  if (!message) {
    return null
  }
  return (
    <span className="text-red-600 bg-red mt-2 mb-3">{message}</span>
  );
}
