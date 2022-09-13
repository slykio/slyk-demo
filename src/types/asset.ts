import { Media } from './media';

export type Asset = {
  code: string;
  decimalPlaces: number;
  decimalPlacesToDisplay: number;
  enabled: boolean;
  logo: Media;
  name: string;
  skipTrailingZeros: boolean;
  symbol: string;
  type: 'custom' | 'crypto' | 'fiat';
};
