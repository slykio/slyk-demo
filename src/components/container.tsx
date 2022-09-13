import { ComponentType, createElement, ReactNode } from 'react';

type Props = {
  as?: string | ComponentType<Props>;
  children?: ReactNode;
  className?: string;
};

export function Container({ as = 'div', children, className = '' }: Props) {
  return createElement(
    as,
    {
      className: `w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ${className}`,
    },
    children
  );
}
