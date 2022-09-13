import { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

export function Card({ className, children }: Props) {
  return (
    <div className={`p-8 bg-white rounded-lg shadow ${className ?? ''}`}>
      {children}
    </div>
  );
}
