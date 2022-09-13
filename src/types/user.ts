import { Media } from './media';

export type User = {
  email: string;
  name: string;
  image: Media;
  primaryWalletId: string;
};
