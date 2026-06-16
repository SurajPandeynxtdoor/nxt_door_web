import { fetchCategories } from "@/lib/api/categories";
import CategoryNavBar from "./CategoryNavBar";

export default async function CategoryNavBarWrapper() {
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
  try {
    categories = await fetchCategories();
  } catch (error) {
    // Don't crash the whole page render if categories fail to load.
    console.error("Failed to load categories for nav bar:", error);
    categories = [];
  }
  return <CategoryNavBar categories={categories} />;
}
