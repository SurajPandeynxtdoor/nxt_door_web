import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/catalog";
import type { CartItem, CartState } from "@/types/cart";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        caseSize: Product["caseSizes"][0];
      }>
    ) => {
      const { product, caseSize } = action.payload;
      const existingItem = state.items.find(
        (item: CartItem) =>
          item.productId === product._id && item.caseSize.size === caseSize.size
      );

      if (existingItem) {
        if (existingItem.quantity + 1 <= existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          brand: product._brand || { _id: "", name: "", logo: "" },
          image: product.images[0],
          caseSize: {
            size: caseSize.size,
            price: caseSize.price,
            offeredPrice: caseSize.offeredPrice,
          },
          quantity: 1,
          stock: product.stock,
        });
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; caseSize: number }>
    ) => {
      state.items = state.items.filter(
        (item: CartItem) =>
          !(
            item.productId === action.payload.productId &&
            item.caseSize.size === action.payload.caseSize
          )
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        caseSize: number;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item: CartItem) =>
          item.productId === action.payload.productId &&
          item.caseSize.size === action.payload.caseSize
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
