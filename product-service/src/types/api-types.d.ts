export interface Product {
  id: string;
  description: string;
  price: number;
  title: string;
  count: number;
}

export type ProductsList = Array<Product>;
