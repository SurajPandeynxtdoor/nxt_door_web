"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Product } from "@/types/catalog";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchCategoryProducts } from "@/lib/api/categories";

interface CategoryProductSectionProps {
  products: Product[];
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  categoryName?: string;
  totalCount?: number;
  categoryId?: string;
}

const CategoryProductSection = ({
  products: initialProducts,
  showPagination = false,
  currentPage: initialPage = 1,
  totalPages: initialTotalPages = 1,
  categoryName,
  totalCount: initialTotalCount = 0,
  categoryId,
}: CategoryProductSectionProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(currentPage < totalPages);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const getGridClass = () => {
    // Always use 2 columns on mobile, matching the home page layout
    return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";
  };

  const getGapClass = () => {
    // Match the gap spacing from ProductSection
    return "gap-2 sm:gap-4 lg:gap-6";
  };

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore || !categoryId) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchCategoryProducts({
        categoryId,
        page: nextPage,
        limit: 20,
        sort: "-createdAt",
      });

      if (response && !response.error && response.categoryProducts) {
        setProducts((prev) => [...prev, ...response.categoryProducts]);
        setCurrentPage(nextPage);
        setTotalCount(response.totalCount);
        setTotalPages(Math.ceil(response.totalCount / 20));
        setHasMore(nextPage < Math.ceil(response.totalCount / 20));
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, categoryId, currentPage]);

  useEffect(() => {
    if (!showPagination || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [showPagination, hasMore, loading, loadMoreProducts]);

  if (products.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No products found in {categoryName}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We&apos;re working on adding more amazing products to this
              category. Check back soon or explore our other categories!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Explore All Products
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/category/all">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Products Grid */}
        <div className="relative">
          <div className={`grid ${getGridClass()} ${getGapClass()}`}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {showPagination && hasMore && (
          <div className="mt-12 flex justify-center">
            <div ref={loadingRef} className="text-center">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more products...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Scroll down to load more products
                </div>
              )}
            </div>
          </div>
        )}

        {/* End of Products Indicator */}
        {showPagination && !hasMore && products.length > 0 && (
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-500">
              Showing all {totalCount} products
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProductSection;
