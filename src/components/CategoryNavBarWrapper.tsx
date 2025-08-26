import { fetchCategories } from "@/lib/api/categories";
import CategoryNavBar from "./CategoryNavBar";

export default async function CategoryNavBarWrapper() {
  const categories = await fetchCategories();
  return <CategoryNavBar categories={categories} />;
}
