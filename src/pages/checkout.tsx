import createSlykClient from '@slyk/slyk-sdk-node';
import { CheckoutLayout } from 'components/checkout-layout';
import Cookies from 'cookies';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ServerSession } from 'server/server-session';
import { Product } from 'types/product';

type Props = {
  product: Product;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { query, req, res } = ctx;
  const slyk = createSlykClient({
    apikey: process.env.SLYK_API_KEY,
    host: 'api.dev.seegno.net',
  });
  const session = new ServerSession(slyk, new Cookies(req, res));
  const token = await session.getToken();
  const { productId } = query;
  const product =
    productId &&
    (await slyk.product.get(query.productId, { include: 'gallery,questions' }));

  if (!token || !product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { user } = await slyk.auth.validate({ token });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};

const Checkout: NextPage<Props> = props => {
  const { product } = props;
  const { query } = useRouter();

  return (
    <CheckoutLayout>
      <CheckoutLayout.Left>foo</CheckoutLayout.Left>
      <CheckoutLayout.Right>
        <div className='aspect-3/4 bg-gray-100 overflow-hidden sm:col-span-4 lg:col-span-5'>
          <img
            className='h-full object-center object-cover'
            src={product.gallery?.[0]?.image.url}
            alt=''
          />
        </div>
        bar
      </CheckoutLayout.Right>
    </CheckoutLayout>
  );
};

export default Checkout;
