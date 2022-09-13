import BigNumber from 'bignumber.js';
import { Asset } from 'types/asset';

export function normalizeAssets(assets: Array<Asset>): Record<string, Asset> {
  return assets.reduce(
    (result, asset) => ({
      ...result,
      [asset.code]: asset,
    }),
    {}
  );
}

export function formatAssetValue(
  assetValue: string,
  asset: Asset,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): string {
  const value = new BigNumber(assetValue);

  if (value.isInteger()) {
    return value.toFixed(0);
  }

  return value.toFixed(
    asset.decimalPlacesToDisplay ?? asset.decimalPlaces,
    roundingMode
  );
}
