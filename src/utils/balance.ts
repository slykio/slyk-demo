import { Balance } from 'types/balance';

function assetKey(
  assetCode: string,
  defaultCurrencyCode: string,
  rewardAssetCode: string | void
): string {
  switch (assetCode) {
    case defaultCurrencyCode:
      return 'defaultCurrency';

    case rewardAssetCode:
      return 'rewardAsset';

    default:
      return 'other';
  }
}

export function sortBalances(
  balances: Array<Balance>,
  defaultCurrencyCode: string,
  rewardAssetCode: string | void
): Array<Balance> {
  const { defaultCurrency, rewardAsset, other } = balances.reduce<{
    defaultCurrency?: Balance;
    rewardAsset?: Balance;
    other: Array<Balance>;
  }>(
    (result, balance) => {
      const key = assetKey(
        balance.assetCode,
        defaultCurrencyCode,
        rewardAssetCode
      );
      if (key === 'other') {
        return {
          ...result,
          other: result.other.concat(balance),
        };
      }
      return {
        ...result,
        [key]: balance,
      };
    },
    { other: [] }
  );

  return [
    ...(defaultCurrency ? [defaultCurrency] : []),
    ...(rewardAsset ? [rewardAsset] : []),
    ...other,
  ];
}
