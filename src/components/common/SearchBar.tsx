"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (value: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value); // 🔥 parent ko bhejna
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      <Input
        type="search"
        placeholder="Search products, brands, categories"
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full h-10 pl-10 pr-10 rounded-md transition-all duration-200",
          isFocused
            ? "ring-2 ring-primary/20 shadow-lg border-transparent"
            : "border-muted-foreground/20 hover:border-primary/30"
        )}
      />
    </div>
  );
};

export default SearchBar;
