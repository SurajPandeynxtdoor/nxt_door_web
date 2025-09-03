"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Package,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addToCart, updateQuantity } from "@/store/slices/CartSlice";
import { toast } from "sonner";

interface ProductDetailSectionProps {
  product: Product;
}

export default function ProductDetailSection({
  product,
}: ProductDetailSectionProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [rating, setRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");

  const images = product.images || [];
  const caseSizes = product.caseSizes || [];
  const brand = product._brand;
  const category = product._category;
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const chosenSize = caseSizes[selectedSize];
    if (!chosenSize) return;
    // Ensure item exists, then set desired quantity
    dispatch(addToCart({ product, caseSize: chosenSize }));
    dispatch(
      updateQuantity({
        productId: product._id,
        caseSize: chosenSize.size,
        quantity,
      })
    );
    toast.success("Added to cart", {
      description: `${product.name} • ${chosenSize.size} • Qty ${quantity}`,
    });
  };

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log("Add to wishlist:", product._id);
  };

  const handleSubmitReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating || !reviewTitle.trim() || !reviewBody.trim()) return;
    // TODO: Wire up API to submit review
    console.log("Submit review:", {
      rating,
      title: reviewTitle,
      body: reviewBody,
      productId: product._id,
    });
    setRating(0);
    setReviewTitle("");
    setReviewBody("");
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-3 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-cyan-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          {category &&
            typeof category === "object" &&
            category?.name &&
            category?._id && (
              <>
                <Link
                  href={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${category._id}`}
                  className="hover:text-cyan-600"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden">
              {images.length > 0 && images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-cyan-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Category */}
            <div className="flex items-center space-x-4">
              {brand && (
                <Badge variant="outline" className="text-sm">
                  {brand.name}
                </Badge>
              )}
              {category && typeof category === "object" && category?.name && (
                <Badge variant="secondary" className="text-sm">
                  {category.name}
                </Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5 • 100 reviews)</span>
            </div>

            {/* Price */}
            {caseSizes.length > 0 && (
              <div className="space-y-4">
                <div className="text-3xl font-bold text-gray-900">
                  ₹
                  {caseSizes[selectedSize]?.offeredPrice ||
                    caseSizes[selectedSize]?.price ||
                    0}
                </div>

                {/* Size Selection */}
                {caseSizes.length > 1 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      Select Size:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseSizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(index)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            selectedSize === index
                              ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Quantity:</h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleWishlist}>
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Product Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm text-gray-600">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm text-gray-600">Quality Assured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm text-gray-600">
                    Secure Packaging
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info: Description & Reviews */}
        <div className="mt-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="border rounded-lg">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              {product.description ? (
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    About this product
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No description available.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {/* Reviews Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-4 border rounded-xl bg-white">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      4.5
                    </span>
                    <span className="text-sm text-gray-500 mb-1">/ 5</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Based on 100 reviews
                  </p>
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((star, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-sm text-gray-600">
                          {star}
                        </span>
                        <Progress className="flex-1" value={star * 15} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-xl bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-4 h-4 ${
                                  idx < 4
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            Great quality product
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Really liked the taste and packaging. Delivery was quick
                        too!
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Review */}
              <div className="mt-8 p-4 border rounded-xl bg-white">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Write a review
                </h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Your rating
                    </label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              rating >= star
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <Input
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your review"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Your name
                      </label>
                      <Input placeholder="Optional" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Your review
                    </label>
                    <Textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      rows={4}
                      placeholder="Share your experience with this product"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#00B7CD] hover:bg-[#00A6BA]"
                    >
                      Submit Review
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
