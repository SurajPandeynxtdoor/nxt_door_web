"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRouter } from "next/navigation";

const CartButton = () => {
  const router = useRouter();
  const items = useAppSelector((state) => state.cart.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 relative"
      onClick={() => router.push("/cart")}
      aria-label="Open cart"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
