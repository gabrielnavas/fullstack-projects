import { Input } from "@/components/ui/input";
import { createRef, FC, useEffect } from "react";

interface IInputSearchProps {
  query: string
  placeholder: string
  onChange: (value: string) => void
  onSubmitEnter: () => void
};

export const InputSearch: FC<IInputSearchProps> = ({
  query,
  onChange,
  onSubmitEnter,
  placeholder,
}) => {
  let inputSearchRef = createRef<HTMLInputElement>();

  useEffect(() => {
    inputSearchRef.current?.focus();
  }, [])

  return (
    <Input
      className="w-[100%]"
      ref={inputSearchRef}
      value={query}
      onChange={e => onChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      onKeyUp={e => e.code === 'Enter' && onSubmitEnter()} />
  );
}
