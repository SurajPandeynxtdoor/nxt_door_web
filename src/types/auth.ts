import { CaseSize, Product } from "./catalog";

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressType: "home" | "work" | "billing" | "shipping" | "other";
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode?: string;
  address?: Address[];
  isActive: boolean;
  isSuperAdmin?: boolean;
  role: "Admin" | "Buyer" | "Seller" | "Employee";
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedSize: CaseSize;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
