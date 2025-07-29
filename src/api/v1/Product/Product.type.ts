export interface IProduct {
  name: string;
  description?: string;
  price: number;
  modelNumber?: string;
  discountPrice?: number;
  currency: string;
  inStock: boolean;
  sap?: string | number;
  rating: {
    score: number;
    count: number;
  };
  images: string[];
  colors: {
    name: string;
    hex: string;
    images: string[];
  }[];
  sizes: string[];
  category: string;
  tags?: string[];
  flags?: {
    label: string;
    type: 'info' | 'success' | 'warning' | 'error';
    icon?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
