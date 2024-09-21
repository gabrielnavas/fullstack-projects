import { FC } from "react";

interface IErrorMessageProps {
  message?: string | undefined
  className?: string
};

export const ErrorMessage: FC<IErrorMessageProps> = ({
  message,
  className,
}) => {
  if (!message) {
    return null
  }
  return (
    <span className={`text-red-600 bg-red mt-2 mb-3 ${className}`}>
      {message}
    </span>
  );
}
