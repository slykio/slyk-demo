import { ComponentType, ReactNode } from 'react';
import styles from './checkout-layout.module.css';
import { Container } from './container';

type Props = {
  children: ReactNode;
};

export function CheckoutLayout({ children }: Props): JSX.Element {
  return (
    <main
      className={`w-full h-screen bg-white flex-1 grid text-gray-900 ${styles.main}`}
    >
      {children}
    </main>
  );
}

CheckoutLayout.Left = function CheckoutLayoutLeft(props: Props): JSX.Element {
  const { children } = props;
  return (
    <Container className={`h-full py-8 ${styles.left}`}>{children}</Container>
  );
};

(CheckoutLayout.Left as ComponentType).displayName = 'CheckoutLayout.Left';

CheckoutLayout.Right = function CheckoutLayoutRight(props: Props): JSX.Element {
  const { children } = props;
  return (
    <Container className={`h-full py-8 bg-slate-100 ${styles.right}`}>
      {children}
    </Container>
  );
};

(CheckoutLayout.Right as ComponentType).displayName = 'CheckoutLayout.Right';
