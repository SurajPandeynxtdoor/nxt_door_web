"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BannerData = {
  id: number;
  image: string;
  link?: string;
  caption?: string;
};

export default function Banner({ bannerData }: { bannerData: BannerData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(
    () =>
      setCurrentSlide((prev) =>
        prev === bannerData.length - 1 ? 0 : prev + 1
      ),
    [bannerData.length]
  );
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));

  useEffect(() => {
    const id = setInterval(nextSlide, 4000);
    return () => clearInterval(id);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl">
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/5]">
        {bannerData.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-all duration-700 transform",
              currentSlide === index
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            )}
            aria-hidden={currentSlide !== index}
          >
            <Link
              href={slide.link || "#"}
              aria-label={`Navigate to ${slide.link || "banner"}`}
              className="block w-full h-full"
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain sm:bg-cover"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Softer, less wide gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
                {/* Optional: Caption or CTA */}
                {slide.caption && (
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-white/80 rounded-lg px-3 py-2 shadow text-gray-900 font-semibold text-xs sm:text-base max-w-xs">
                    {slide.caption}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* Navigation buttons */}
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
          {currentSlide + 1} / {bannerData.length}
        </span>
        {bannerData.map((_, index) => (
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
    </div>
  );
}
