import type { Product } from "@/types/catalog";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductSectionProps {
  title?: string;
  description?: React.ReactNode;
  products: Product[];
  isLoading?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  baseUrl?: string;
  searchParams?: Record<string, string>;
  bullets?: string[];
  tags?: string[];
}

const ProductSection = ({
  title,
  description,
  products,
  isLoading = false,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  baseUrl,
  bullets,
  tags = [
    "Plant‑based proteins",
    "Organic snacks",
    "Natural sweeteners",
    "Premium dry fruits",
    "Clean ingredients",
    "Wholesome foods",
  ],
}: ProductSectionProps) => {
  return (
    <section className="py-3 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-2 sm:mb-3 lg:mb-4 px-2 bg-gradient-to-r from-cyan-600 via-emerald-600 to-rose-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-rose-300 rounded-full mb-4"></div>
          </div>
          {description ? (
            typeof description === "string" ? (
              <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
                {description}
              </p>
            ) : (
              <div className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
                {description}
              </div>
            )
          ) : (
            <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
              <span className="font-semibold text-cyan-700">
                Clean, honest, and wholesome foods
              </span>{" "}
              at Nxt Door Retail. Discover{" "}
              <span className="font-semibold text-emerald-700">
                plant-based proteins
              </span>
              ,{" "}
              <span className="font-semibold text-amber-700">
                organic snacks
              </span>
              ,{" "}
              <span className="font-semibold text-pink-700">
                natural sweeteners
              </span>
              , and more.
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 px-2">
              {tags.map((t, i) => {
                const colors = [
                  "bg-cyan-600",
                  "bg-emerald-600",
                  "bg-rose-600",
                  "bg-amber-600",
                  "bg-pink-600",
                  "bg-indigo-600",
                ];
                return (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium shadow-sm ${
                      colors[i % colors.length]
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}
          {bullets && bullets.length > 0 && (
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto text-sm sm:text-base px-2">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-2 p-3 rounded-lg bg-white/90 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-800">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 2xl:gap-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm flex flex-col border border-gray-100 overflow-hidden min-h-[380px] sm:min-h-[470px] lg:min-h-[520px] xl:min-h-[600px] p-4"
                >
                  <Skeleton className="h-40 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full mt-auto" />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 text-lg">
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild
            >
              <Link href={`${baseUrl}?page=${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`${baseUrl}?page=${pageNum}`}>{pageNum}</Link>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              asChild
            >
              <Link href={`${baseUrl}?page=${currentPage + 1}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
