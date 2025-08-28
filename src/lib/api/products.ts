import { Product } from "@/types/catalog";

export interface ProductListResponse {
  error: boolean;
  message: string;
  allProducts: Product[];
  totalCount: number;
}

export interface ProductDetailResponse {
  error: boolean;
  message: string;
  product: Product;
}

export async function fetchProducts({
  page = 1,
  limit = 10,
  sort = "createdAt",
  productBy = "Admin",
  search = "",
  filter = "",
}: {
  page?: number;
  limit?: number;
  sort?: string;
  productBy?: string;
  search?: string;
  filter?: string;
} = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
    productBy,
    search,
    filter,
  });
  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/api/home/products?${params.toString()}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    next: { revalidate: 60 },
    signal: controller.signal,
  });
  clearTimeout(t);

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.message || "Unknown error from API");
  return data;
}

export async function fetchProductDetails(
  productId: string
): Promise<ProductDetailResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/home/product/${productId}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    next: { revalidate: 60 },
    signal: controller.signal,
  });
  clearTimeout(t);

  if (!res.ok)
    throw new Error(`Failed to fetch product details: ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.message || "Unknown error from API");
  return data;
}
