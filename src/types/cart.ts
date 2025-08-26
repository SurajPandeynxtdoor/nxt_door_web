import type { Brand } from "@/types/catalog";

export interface CartItemCaseSize {
  size: number;
  price: number;
  offeredPrice: number;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: Brand | { _id: string; name?: string; logo?: string };
  image: string;
  caseSize: CartItemCaseSize;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
