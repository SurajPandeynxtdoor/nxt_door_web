import { Category, Product } from "@/types/catalog";

export interface CategoryListResponse {
  error: boolean;
  message: string;
  allCategory: Category[];
  categoryProducts: Product[];
  totalCount: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return []; // don’t block build if env missing

  const url = `${base}/api/category-list`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    signal: controller.signal,
  });
  clearTimeout(t);

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
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("API base missing");

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });
  const url = `${base}/api/home/category/${categoryId}?${params.toString()}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    next: { revalidate: 60 },
    signal: controller.signal,
  });
  clearTimeout(t);

  if (!res.ok)
    throw new Error(`Failed to fetch category products: ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.message || "Unknown error from API");
  return data;
}
