import { Category, Product } from "@/types/catalog";

export interface CategoryListResponse {
  error: boolean;
  message: string;
  allCategory: Category[];
  categoryProducts: Product[];
  totalCount: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/category-list`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data.categories) return data.categories;
  return [];
}

export async function fetchCategoryProducts({
  categoryId,
  page = 1,
  limit = 20,
  sort = "-createdAt",
}: {
  categoryId: string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<CategoryListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/api/home/category/${categoryId}?${params.toString()}`;

  console.log("Fetching category products from:", url); // Debug log

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    console.error("API Error:", res.status, res.statusText); // Debug log
    throw new Error(`Failed to fetch category products: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("API Response:", data); // Debug log

  if (data.error) {
    throw new Error(data.message || "Unknown error from API");
  }

  return data;
}
