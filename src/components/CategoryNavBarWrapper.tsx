import { fetchCategories } from "@/lib/api/categories";
import CategoryNavBar from "./CategoryNavBar";
import { Category } from "@/types/catalog";

export default async function CategoryNavBarWrapper() {
  // The category nav is non-critical chrome. If the category-list API is
  // unavailable, slow (request times out), or returns a bad payload,
  // fetchCategories throws. Because this async Server Component is rendered as
  // a JSX child, that throw escapes the page bodies' try/catch blocks and
  // crashes the whole route into the error boundary ("An error occurred in
  // the Server Components render"). Degrade gracefully instead.
  let categories: Category[] = [];
  try {
    categories = await fetchCategories();
  } catch (error) {
    console.error("Failed to load categories for nav bar:", error);
  }

  return <CategoryNavBar categories={categories} />;
}
