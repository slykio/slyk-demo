# Wallet

TODO: Introduction

## Wallet overview

This part of the guide will cover how to show the user's wallet balance and
activity.

This data will be retrieved from the Slyk API inside a Next.js
`getServerSideProps` method using the Slyk SDK.

1. Get the list of assets

One thing you'll need is the list of assets. This includes formatting
information, like the asset's symbol and decimal places.

The assets can be retrieved with the `slyk.asset.list` method. Be sure to
request all the enabled assets, like shown in the following snippet:

```ts
const assets = await slyk.asset.list({
  all: true,
  filter: { enabled: 'true' },
});
const assetList = assets.results;
```

2. Get the user's balance

Then request the user's balance. For this you'll first need to validate the
JWT using `slyk.auth.validate`. This will give you the user object. With this
you can now request the balance of the user's primary wallet using the
`slyk.wallet.balance` method, which gives you the list of balances in that
wallet on each asset.

```ts
const { user } = await slyk.auth.validate({ token });
const balance = await slyk.wallet.balance(user.primaryWalletId);
```

3. Get the wallet activity

```ts
const activity = await slyk.wallet.activity(user.primaryWalletId, {
  page: {
    number: pageNumber,
    size: pageSize,
  },
});
const activityList = activity.results;
const activityTotal = activity.total;
```

3. Get the featured products

```ts
const products = await slyk.product.list({
  filter: { available: 'true', featured: 'true', visible: 'true' },
  all: true,
  sort: [{ name: '-updatedAt' }],
  include: 'gallery,questions',
});
const productList = products.results;
```

4. Put it all together

```ts
export async function getServerSideProps({ req, res }) {
  const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const assets = await slyk.asset.list({
    all: true,
    filter: { enabled: 'true' },
  });
  const assetList = assets.results;

  const { user } = await slyk.auth.validate({ token });
  const balances = await slyk.wallet.balance(user.primaryWalletId);

  const products = await slyk.product.list({
    filter: { available: 'true', featured: 'true', visible: 'true' },
    all: true,
    sort: [{ name: '-updatedAt' }],
    include: 'gallery,questions',
  });
  const productList = products.results;

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      assets: JSON.parse(JSON.stringify(assetList)),
      balances: JSON.parse(JSON.stringify(balances)),
      featuredProducts: JSON.parse(JSON.stringify(productList)),
    },
  };
}
```
