import { Media } from './media';

export enum ProductQuestionType {
  Text = 'text',
  Single = 'single',
  Multiple = 'multiple',
  Date = 'date',
  Time = 'time',
}

export type ProductQuestion = {
  description: string | null;
  id: string;
  jsonSchema: object;
  required: boolean;
  title: string;
  typeCode: ProductQuestionType;
  values: Array<string>;
};

export type Product = {
  allowChoosingQuantity: boolean;
  assetCode: string;
  available: boolean;
  bonus: string;
  categoryId: string;
  createdAt: string;
  description: string;
  featured: boolean;
  gallery?: Array<{
    image: Media;
  }>;
  id: string;
  name: string;
  price: string;
  questions: Array<ProductQuestion>;
  taxRateId: string | null;
  thumbnail: Media;
  typeCode: string;
  updatedAt: string;
  visible: boolean;
};
