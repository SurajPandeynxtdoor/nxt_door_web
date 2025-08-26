export interface CategoryBanner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  categoryIds: string[];
  keywords: string[];
}

export const categoryBanners: CategoryBanner[] = [
  {
    id: "organic-snacks",
    image: "/images/wholenacks.jpg",
    title: "Organic & Wholesome Snacks",
    subtitle: "Discover our collection of natural, healthy snacks",
    link: "/category/organic-snacks",
    categoryIds: ["67b84fe563859bb82f1c5048"], // Replace with actual category IDs
    keywords: ["organic", "snacks", "wholesome", "healthy"],
  },
  {
    id: "natural-sweeteners",
    image: "/images/desikhand.jpg",
    title: "Natural Sweeteners",
    subtitle: "Pure, chemical-free sweeteners for your healthy lifestyle",
    link: "/category/natural-sweeteners",
    categoryIds: [], // Add actual category IDs
    keywords: ["sweeteners", "natural", "desi", "khand", "sugar-free"],
  },
  {
    id: "premium-cashews",
    image: "/images/cashews.jpg",
    title: "Premium Cashews",
    subtitle: "Handpicked premium quality cashews",
    link: "/category/premium-cashews",
    categoryIds: [], // Add actual category IDs
    keywords: ["cashews", "nuts", "premium", "dry fruits"],
  },
  {
    id: "flavored-snacks",
    image: "/images/roastedmakhanabanner.jpeg",
    title: "Flavored Snacks",
    subtitle: "Delicious and healthy flavored snacks",
    link: "/category/flavored-snacks",
    categoryIds: [], // Add actual category IDs
    keywords: ["flavored", "snacks", "makhanas", "roasted"],
  },
  {
    id: "guilt-free-snacks",
    image: "/images/makhanachocolate.jpeg",
    title: "Guilt-Free Snacks",
    subtitle: "Indulge without the guilt",
    link: "/category/guiltmakhana",
    categoryIds: [], // Add actual category IDs
    keywords: ["guilt-free", "chocolate", "makhanas", "healthy"],
  },
  {
    id: "plant-based-protein",
    image: "/images/onlytruthbanner.jpeg",
    title: "Plant-Based Protein",
    subtitle: "Pure protein from nature's best sources",
    link: "/category/plant-based-protein",
    categoryIds: [], // Add actual category IDs
    keywords: ["protein", "plant-based", "sattu", "natural"],
  },
];

export function getCategoryBanners(
  categoryId: string,
  categoryName: string
): CategoryBanner[] {
  // First, try to find banners by category ID
  const directMatches = categoryBanners.filter((banner) =>
    banner.categoryIds.includes(categoryId)
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  // If no direct matches, find banners by keywords in category name
  const categoryNameLower = categoryName.toLowerCase();
  const keywordMatches = categoryBanners.filter((banner) =>
    banner.keywords.some((keyword) =>
      categoryNameLower.includes(keyword.toLowerCase())
    )
  );

  return keywordMatches;
}

export function getDefaultBanners(): CategoryBanner[] {
  // Return a selection of general banners for categories without specific banners
  return categoryBanners.slice(0, 3);
}
