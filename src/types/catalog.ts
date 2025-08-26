export interface Brand {
  _id: string;
  name?: string;
  logo?: string;
}

export interface CaseSize {
  _id?: string;
  size: number;
  price: number;
  offeredPrice: number;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  images?: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  stock: number;
  caseSizes: CaseSize[];
  productBy: "Admin" | "Seller";
  images: string[];
  _brand?: Brand;
  _category?: string | Category;
  _createdBy: string;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  badges?: string[];
  badge?: string;
  features?: string[];
  weight?: number;
  quantity?: number;
  quantityUnit?: "pieces" | "kg" | "g" | "l" | "ml";
}
