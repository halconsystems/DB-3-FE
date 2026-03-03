import { ReactNode, ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export default function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}