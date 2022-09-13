import { ReactNode } from 'react';
import { Container } from './container';
import styles from './stacked-layout.module.css';

type Props = {
  children: ReactNode;
  navbar: ReactNode;
  title: string;
};

export function StackedLayout({ children, navbar, title }: Props) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      {navbar}
      <main
        className={`w-full bg-slate-100 flex-1 grid text-gray-900 ${styles.main}`}
      >
        <div className={`bg-slate-800 ${styles.headerBackground}`} />

        <Container as='header' className={`px-10 py-8 ${styles.header}`}>
          <h1 className='text-3xl font-bold text-white'>{title}</h1>
        </Container>

        <Container as='section' className={styles.content}>
          {children}
        </Container>
      </main>
    </div>
  );
}
