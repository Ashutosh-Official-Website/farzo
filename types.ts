
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  specs: ProductSpec[];
  reviews: Review[];
}

export type ViewType = 'WEB' | 'MOBILE';

export enum Page {
  HOME = 'home',
  SHOP = 'shop',
  PRODUCT = 'product',
  CART = 'cart',
  PROFILE = 'profile',
  DESIGN_SYSTEM = 'design_system',
  WISHLIST = 'wishlist',
  COMPARE = 'compare',
  CHECKOUT = 'checkout'
}

export interface CartItem extends Product {
  quantity: number;
}
