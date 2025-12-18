"use client";

import type { Product } from "@/types/catalog";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "@/store/slices/CartSlice";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  // 🔹 SELECTED CASE SIZE (default or first)
  const [selectedCaseSize, setSelectedCaseSize] = useState(
    product.caseSizes?.find((s) => s.isDefault) || product.caseSizes?.[0]
  );

  const isOutOfStock = product.stock === 0;

  // 🔹 Get cart item for this product + selected case size
  const cartItem = useAppSelector((s) =>
    s.cart.items.find(
      (it) =>
        it.productId === product._id &&
        it.caseSize.size === selectedCaseSize?.size
    )
  );

  // 🔹 Discount calculation
  const discountPercentage =
    selectedCaseSize && selectedCaseSize.price > selectedCaseSize.offeredPrice
      ? Math.round(
          ((selectedCaseSize.price - selectedCaseSize.offeredPrice) /
            selectedCaseSize.price) *
            100
        )
      : 0;

  return (
    <Link href={`/product/${product._id}`} className="block">
      <div className="group relative rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col min-h-0 flex-1 border border-gray-100 hover:border-gray-200 overflow-hidden cursor-pointer will-change-transform hover:-translate-y-0.5">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
            <span className="bg-white p-1 rounded-full shadow-lg block">
              <Image
                src={product.badge}
                alt="Brand Badge"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              />
            </span>
          </div>
        )}

        {/* Discount */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-xs">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 px-3 pt-2 pb-2 gap-1 sm:px-4 sm:pt-4 sm:pb-4 sm:gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded-md">
              {product._brand?.name}
            </p>
          </div>

          <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-0.5 line-clamp-2 min-h-[2.2em] leading-tight group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>

          <div className="mb-1 min-h-[1.2em] text-[11px] sm:text-xs text-green-700 w-full break-words">
            {(product?.features && product.features.length > 0
              ? product.features
              : [
                  "100% Organic & Natural",
                  "High in Protein & Low in Fat",
                  "Gluten‑Free & Cholesterol‑Free",
                ]
            ).join(" • ")}
          </div>

          {/* Price & Case Size Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-y-1 gap-x-2 min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-xl font-bold text-gray-900">
                ₹{selectedCaseSize?.offeredPrice || selectedCaseSize?.price}
              </span>
              {selectedCaseSize?.price > selectedCaseSize?.offeredPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{selectedCaseSize?.price}
                </span>
              )}
            </div>
            <div className="w-full sm:w-28 sm:max-w-[140px] min-w-0">
              <Select
                value={selectedCaseSize?.size?.toString()}
                onValueChange={(value) => {
                  const newSize = product.caseSizes?.find(
                    (s) => s.size.toString() === value
                  );
                  if (newSize) setSelectedCaseSize(newSize);
                }}
              >
                <SelectTrigger className="h-7 sm:h-9 text-[11px] sm:text-sm bg-white border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-colors rounded-lg shadow-sm w-full min-w-0 truncate overflow-hidden">
                  {selectedCaseSize ? (
                    <span className="truncate block">{`${selectedCaseSize.size} psc`}</span>
                  ) : (
                    <SelectValue placeholder="Choose variant" />
                  )}
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] w-auto">
                  {product.caseSizes?.map((caseSize) => (
                    <SelectItem
                      key={caseSize.size}
                      value={caseSize.size.toString()}
                      className="text-[11px] sm:text-sm hover:bg-cyan-50 focus:bg-cyan-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{caseSize.size} psc</span>
                        <span className="text-[11px] sm:text-xs text-gray-500">
                          ₹{caseSize.offeredPrice}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock & Add to Cart */}
          <div className="mt-auto space-y-1 sm:space-y-2">
            <div className="flex items-center text-[11px] sm:text-xs text-gray-600">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>

            {cartItem ? (
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!selectedCaseSize) return;

                    if (cartItem.quantity <= 1) {
                      dispatch(
                        removeFromCart({
                          productId: product._id,
                          caseSize: selectedCaseSize.size,
                        })
                      );
                    } else {
                      dispatch(
                        updateQuantity({
                          productId: product._id,
                          caseSize: selectedCaseSize.size,
                          quantity: cartItem.quantity - 1,
                        })
                      );
                    }
                  }}
                >
                  -
                </Button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">
                  {cartItem.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!selectedCaseSize) return;

                    if (cartItem.quantity < product.stock) {
                      dispatch(
                        updateQuantity({
                          productId: product._id,
                          caseSize: selectedCaseSize.size,
                          quantity: cartItem.quantity + 1,
                        })
                      );
                    } else {
                      toast.error("Max stock reached");
                    }
                  }}
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                className="w-full px-2 py-1.5 sm:px-4 sm:py-3 bg-gradient-to-r from-[#00B7CD] to-[#0099AD] text-white text-xs sm:text-base font-semibold hover:from-[#00A6B9] hover:to-[#008EA1] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 rounded-xl shadow-md hover:shadow-lg"
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!selectedCaseSize) return;

                  // Ensure full CaseSize object is passed
                  const fullCaseSize = product.caseSizes?.find(
                    (s) => s.size === selectedCaseSize.size
                  );
                  if (!fullCaseSize) return;

                  dispatch(addToCart({ product, caseSize: fullCaseSize }));

                  toast.success("Added to cart", {
                    description: `${product.name} • ${fullCaseSize.size}`,
                  });
                }}
              >
                {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
