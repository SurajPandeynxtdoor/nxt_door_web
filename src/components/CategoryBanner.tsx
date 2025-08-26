"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryBanner as CategoryBannerType } from "@/lib/categoryBanners";

interface CategoryBannerProps {
  banners: CategoryBannerType[];
  categoryName: string;
}

export default function CategoryBanner({ banners }: CategoryBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl mb-8">
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/5]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-all duration-700 transform",
              currentSlide === index
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            )}
            aria-hidden={currentSlide !== index}
          >
            <Link
              href={banner.link || "#"}
              aria-label={`Navigate to ${banner.title || "banner"}`}
              className="block w-full h-full"
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain sm:bg-cover"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

                {/* Banner content */}
                {/* <div className="absolute inset-0 flex items-center">
                  <div className="ml-6 sm:ml-12 md:ml-16 text-white">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      {banner.title || categoryName}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl mb-4 opacity-90">
                        {banner.subtitle}
                      </p>
                    )}
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      Explore Products
                    </Button>
                  </div>
                </div> */}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white shadow-lg z-20 h-9 w-9"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white shadow-lg z-20 h-9 w-9"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <span className="text-xs text-white bg-black/50 rounded-full px-2 py-0.5">
              {currentSlide + 1} / {banners.length}
            </span>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white",
                  currentSlide === index
                    ? "bg-white w-5 h-2"
                    : "bg-white/50 hover:bg-white/75 w-2 h-2"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
