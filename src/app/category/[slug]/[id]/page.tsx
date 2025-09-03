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
        title: "Category Not Found | Only Truth No Secrets",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} - Natural & Organic Products | Only Truth No Secrets`,
      description:
        category.description ||
        `Explore our collection of ${category.name.toLowerCase()} - natural, organic, and wholesome products from Only Truth No Secrets.`,
      keywords: `${category.name}, natural products, organic, wholesome foods, Only Truth No Secrets`,
      alternates: {
        canonical: `https://www.onlytruthnosecrets.com/category/${category.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${category._id}`,
      },
      openGraph: {
        title: `${category.name} - Natural & Organic Products | Only Truth No Secrets`,
        description:
          category.description ||
          `Explore our collection of ${category.name.toLowerCase()} - natural, organic, and wholesome products from Only Truth No Secrets.`,
        url: `https://www.onlytruthnosecrets.com/category/${category.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${category._id}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error loading category metadata:", error);
    return {
      title: "Category | Only Truth No Secrets",
      description: "Explore our natural and organic products.",
    };
  }
}

export async function generateStaticParams() {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return [];
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
          item: "https://www.onlytruthnosecrets.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: currentCategory.name,
          item: `https://www.onlytruthnosecrets.com/category/${currentCategory.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${id}`,
        },
      ],
    };

    return (
      <main className="min-h-screen">
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
            <>
              <p>
                At Only Truth No Secrets, our {currentCategory.name} range is
                curated with a simple promise: clean, honest ingredients that
                taste great and make you feel good. Every item is sourced from
                trusted partners, handled with care, and offered at fair,
                transparent prices—so you can bring home quality without
                compromise.
              </p>
              <p className="mt-3">
                We prioritise natural goodness over shortcuts. That means
                thoughtfully selected ingredients, minimal processing, and
                products that avoid unnecessary additives like artificial
                colours, flavours, or preservatives. Whether you’re stocking a
                healthy pantry, planning quick snacks, or exploring functional
                foods for everyday wellness, our{" "}
                {currentCategory.name.toLowerCase()} collection is designed to
                fit modern lifestyles without losing the authenticity you
                expect.
              </p>
            </>
          }
        />

        {/* Products Section */}
        <CategoryProductSection
          id="products"
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
