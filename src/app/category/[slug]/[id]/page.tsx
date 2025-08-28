import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategoryProducts, fetchCategories } from "@/lib/api/categories";
import CategoryNavBarWrapper from "@/components/CategoryNavBarWrapper";
import CategoryProductSection from "@/components/CategoryProductSection";
import Footer from "@/components/common/Footer";
import CategoryBanner from "@/components/CategoryBanner";
import { getCategoryBanners, getDefaultBanners } from "@/lib/categoryBanners";
import CategoryIntro from "@/components/CategoryIntro";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  try {
    const categories = await fetchCategories();
    const { id } = await params;
    const category = categories.find((cat) => cat._id === id);

    if (!category) {
      return {
        title: "Category Not Found | NxtDoor Retail",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} - Natural & Organic Products | NxtDoor Retail`,
      description:
        category.description ||
        `Explore our collection of ${category.name.toLowerCase()} - natural, organic, and wholesome products from NxtDoor Retail.`,
      keywords: `${category.name}, natural products, organic, wholesome foods, NxtDoor Retail`,
      alternates: {
        canonical: `https://www.nxtdoorretail.com/category/${category.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${category._id}`,
      },
      openGraph: {
        title: `${category.name} - Natural & Organic Products | NxtDoor Retail`,
        description:
          category.description ||
          `Explore our collection of ${category.name.toLowerCase()} - natural, organic, and wholesome products from NxtDoor Retail.`,
        url: `https://www.nxtdoorretail.com/category/${category.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${category._id}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error loading category metadata:", error);
    return {
      title: "Category | NxtDoor Retail",
      description: "Explore our natural and organic products.",
    };
  }
}

export async function generateStaticParams() {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return []; // skip pregen if API base missing
    const categories = await fetchCategories();
    return categories.map((category) => ({
      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      id: category._id,
    }));
  } catch (error) {
    console.error("Error loading category static params:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  try {
    const { id } = await params;
    const { page, sort } = await searchParams;

    const pageNum = parseInt(page || "1");
    const sortParam = sort || "-createdAt";

    const categoryData = await fetchCategoryProducts({
      categoryId: id,
      page: pageNum,
      limit: 20,
      sort: sortParam,
    });

    if (!categoryData || categoryData.error) {
      notFound();
    }

    const currentCategory = categoryData.allCategory.find(
      (cat) => cat._id === id
    );

    if (!currentCategory) {
      notFound();
    }

    const totalPages = Math.ceil(categoryData.totalCount / 20);

    // Get category-specific banners
    const categoryBanners = getCategoryBanners(id, currentCategory.name);
    const bannersToShow =
      categoryBanners.length > 0 ? categoryBanners : getDefaultBanners();

    console.log(currentCategory);

    // Breadcrumb JSON-LD for category
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.nxtdoorretail.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: currentCategory.name,
          item: `https://www.nxtdoorretail.com/category/${currentCategory.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${id}`,
        },
      ],
    };

    return (
      <main className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <CategoryNavBarWrapper />

        {/* Category Banner */}
        <CategoryBanner
          banners={bannersToShow}
          categoryName={currentCategory.name}
        />

        <CategoryIntro
          description={
            currentCategory.description ||
            `Discover premium ${currentCategory.name.toLowerCase()} — crafted for quality, taste, and wellness.`
          }
        />

        {/* Products Section */}
        <CategoryProductSection
          products={categoryData.categoryProducts}
          showPagination={true}
          currentPage={pageNum}
          totalPages={totalPages}
          categoryName={currentCategory.name}
          totalCount={categoryData.totalCount}
          categoryId={id}
        />

        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
