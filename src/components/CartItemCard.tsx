"use client";

import Image from "next/image";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { CartItem } from "@/types/cart";
import { removeFromCart, updateQuantity } from "@/store/slices/CartSlice";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();
  const allCartItems = useAppSelector((state) => state.cart.items);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(
        removeFromCart({
          productId: item.productId,
          caseSize: item.caseSize.size,
        })
      );
      return;
    }

    const totalPiecesOfProductInCart = allCartItems
      .filter((i) => i.productId === item.productId)
      .reduce((sum, i) => sum + i.quantity * i.caseSize.size, 0);

    const piecesForThisItem = item.quantity * item.caseSize.size;
    const piecesForOtherItemsOfSameProduct =
      totalPiecesOfProductInCart - piecesForThisItem;
    const newPiecesForThisItem = newQuantity * item.caseSize.size;

    if (piecesForOtherItemsOfSameProduct + newPiecesForThisItem <= item.stock) {
      dispatch(
        updateQuantity({
          productId: item.productId,
          caseSize: item.caseSize.size,
          quantity: newQuantity,
        })
      );
    } else {
      console.log(`Not enough stock. Only ${item.stock} available.`);
    }
  };

  const totalPiecesOfProductInCart = allCartItems
    .filter((i) => i.productId === item.productId)
    .reduce((sum, i) => sum + i.quantity * i.caseSize.size, 0);

  const canAddMore =
    totalPiecesOfProductInCart + item.caseSize.size <= item.stock;

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 relative border rounded-lg p-1 bg-white">
          <Image
            src={item.image || "/images/NXTDoor.jpeg"}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain rounded-lg"
            priority={false}
          />
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.caseSize.size} pieces / case
          </p>
          <p className="font-bold text-lg text-gray-900 mt-1">
            ₹{Number(item.caseSize.offeredPrice || 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex-grow flex justify-end items-center mt-4 sm:mt-0">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="px-3 py-1 text-lg hover:bg-gray-100 rounded-l-md"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-1 font-semibold border-l border-r">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={!canAddMore}
            className="px-3 py-1 text-lg hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-r-md"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
