"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
}

interface CategoryNavBarProps {
  categories: Category[];
}

const CategoryNavBar = ({ categories }: CategoryNavBarProps) => {
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navCategories = [
    { name: "Home", id: "home", path: "/" },
    ...(categories?.map((cat) => ({
      name: cat.name,
      id: cat._id,
      path: `/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}/${
        cat._id
      }`,
    })) || []),
    { name: "All Products", id: "all", path: "/category/all" },
  ];

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto relative">
        {showLeftScroll && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-green-100/90 to-green-200/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg shadow-green-100/20 hover:shadow-green-200/30 transition-all duration-200 hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-green-800/70" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-6 px-4 overflow-x-auto scrollbar-hide relative"
        >
          <div className="flex items-center space-x-6 py-3 last:hidden ">
            {navCategories.map((category) => {
              const isActive = pathname === category.path;
              return (
                <Link
                  key={category.id}
                  href={category.path}
                  className={cn(
                    "text-sm whitespace-nowrap transition-all duration-300 font-medium px-4 py-1.5 rounded-full",
                    "hover:bg-gradient-to-r hover:from-green-200/80 hover:to-green-100/80 hover:text-green-800",
                    "hover:shadow-sm hover:shadow-green-200/50",
                    isActive
                      ? "bg-gradient-to-r from-green-500/90 to-green-400/90 text-white shadow-md shadow-green-200/50"
                      : "text-green-800/70 bg-transparent"
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        {showRightScroll && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-green-100/90 to-green-200/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg shadow-green-100/20 hover:shadow-green-200/30 transition-all duration-200 hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-green-800/70" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryNavBar;
