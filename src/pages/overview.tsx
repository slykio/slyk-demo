import { useProfile } from 'components/session-provider';
import Cookies from 'cookies';
import type { GetServerSideProps, NextPage } from 'next';
import { User } from 'types/user';
import createSlykClient from '@slyk/slyk-sdk-node';
import { Balance } from 'types/balance';
import { Navbar } from 'components/navbar';
import { StackedLayout } from 'components/stacked-layout';
import { ServerSession } from 'server/server-session';
import { Card } from 'components/card';
import { Product } from 'types/product';
import { Asset } from 'types/asset';
import { formatAssetValue, normalizeAssets } from 'utils/assets';
import { ProductModal } from 'components/product-modal';
import { useState } from 'react';
import { sortBalances } from 'utils/balance';
import BigNumber from 'bignumber.js';

type Props = {
  user: User;
  assets: Record<string, Asset>;
  defaultCurrency: Asset;
  rewardAsset: Asset | null;
  balances: Array<Balance>;
  featuredProducts: Array<Product>;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { req, res } = ctx;
  const slyk = createSlykClient({
    apikey: process.env.SLYK_API_KEY,
    host: 'api.dev.seegno.net',
  });
  const session = new ServerSession(slyk, new Cookies(req, res));
  const token = await session.getToken();

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { user } = await slyk.auth.validate({ token });
  const [assetList, balances, products, settings] = await Promise.all([
    slyk.asset.list({
      all: true,
      filter: { enabled: 'true' },
    }),
    slyk.wallet.balance(user.primaryWalletId),
    slyk.product.list({
      filter: { available: 'true', featured: 'true', visible: 'true' },
      all: true,
      sort: [{ name: '-updatedAt' }],
      include: 'gallery,questions',
    }),
    slyk.setting.list(),
  ]);

  const assets = JSON.parse(JSON.stringify(normalizeAssets(assetList.results)));
  const defaultCurrencyCode = settings.results.find(
    (setting: any) => setting.code === 'defaultCurrency'
  )?.value;
  const rewardAssetCode = settings.results.find(
    (setting: any) => setting.code === 'defaultBonusAssetCode'
  )?.value;

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      assets: assets,
      defaultCurrency: assets[defaultCurrencyCode] ?? null,
      rewardAsset: assets[rewardAssetCode] ?? null,
      balances: sortBalances(balances, defaultCurrencyCode, rewardAssetCode),
      featuredProducts: JSON.parse(JSON.stringify(products.results)),
    },
  };
};

function getAssetColor(
  assetCode: string,
  defaultCurrencyCode: string,
  rewardAssetCode: string | void
): string {
  switch (assetCode) {
    case defaultCurrencyCode:
      return 'bg-blue-200';

    case rewardAssetCode:
      return 'bg-purple-200';

    default:
      return 'bg-slate-200';
  }
}

const Overview: NextPage<Props> = props => {
  const { assets, defaultCurrency, rewardAsset, balances, featuredProducts } =
    props;
  const user = useProfile() as User;
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [product, setProduct] = useState<Product | null>();

  return (
    <>
      <StackedLayout navbar={<Navbar user={user} />} title='Dashboard'>
        <Card className='h-full'>
          <h2 className='text-2xl mb-4'>Wallet balance</h2>
          <ul className='flex flex-wrap gap-4'>
            {balances.map(balance => {
              const asset = assets[balance.assetCode];
              return (
                <li
                  className='rounded-md bg-white flex overflow-hidden'
                  key={balance.assetCode}
                >
                  <div
                    className={`px-5 py-4 uppercase ${getAssetColor(
                      balance.assetCode,
                      defaultCurrency.code,
                      rewardAsset?.code
                    )}`}
                  >
                    {asset?.symbol ?? balance.assetCode}
                  </div>
                  <div className='px-5 py-4 rounded-r-md border-y border-r border-slate-200'>
                    {formatAssetValue(balance.amount, asset)}
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className='text-2xl mt-8 mb-4'>Featured products</h2>

          <ul className='grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4'>
            {featuredProducts.map(product => {
              const asset = assets[product.assetCode];
              return (
                <li
                  className='cursor-pointer transition-opacity hover:opacity-70'
                  key={product.id}
                  onClick={() => {
                    setProduct(product);
                    setProductModalVisible(true);
                  }}
                >
                  <img
                    className='w-full aspect-3/4 object-cover'
                    alt={`Picture of ${product.name}`}
                    src={product.thumbnail.url}
                  />
                  <div className='mt-2 text-sm text-gray-700'>
                    {product.name}
                  </div>
                  <div className='mt-1 text-lg text-gray-900'>
                    {new BigNumber(product.price).isEqualTo(0) ? (
                      'Free'
                    ) : (
                      <>
                        <span className='uppercase'>
                          {asset?.symbol ?? product.assetCode + ''}
                        </span>
                        {formatAssetValue(
                          product.price,
                          asset,
                          BigNumber.ROUND_UP
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </StackedLayout>

      {product && (
        <ProductModal
          product={product}
          asset={assets[product.assetCode]}
          isVisible={isProductModalVisible}
          onClose={() => setProductModalVisible(false)}
        />
      )}
    </>
  );
};

export default Overview;
