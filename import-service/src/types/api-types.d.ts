export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};

export type ProductsList = Array<Product>;

export type Stock = {
  product_id: string;
  count: number;
};

export type ProductPostBody = {
  title: string;
  description: string;
  price: number;
  count: number;
};
