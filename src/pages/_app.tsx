import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'components/session-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider initialUser={pageProps.user}>
      <Head>
        <title>Slyk demo</title>
        <link href='/favicon.ico' rel='icon' />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
