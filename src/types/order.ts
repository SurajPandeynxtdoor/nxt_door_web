// src/types/order.ts
import type { Product } from "./catalog";

export interface OrderItemCaseSize {
  size: number;
  price?: number;
  offeredPrice?: number;
}

export interface OrderItem {
  _product: Product | string;
  quantity: number;
  price: number;
  caseSize?: OrderItemCaseSize;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
    | string;
  paymentMethod: "cod" | "onlineTransfer" | string;
  paymentStatus: "pending" | "completed" | "failed" | string;
  totalAmount: number;
  totalUnits: number;
  totalCases: number;
  createdAt: string;
  trackingNumber?: string;
  shippingAddress: {
    snapshot: {
      fullName: string;
      phone?: string;
      street: string;
      city: string;
      state: string;
      country?: string;
      postalCode: string;
      isDefault?: boolean;
    };
  };
  paymentDetails?: { razorpayOrderId?: string };
  shippingDate?: string;
  deliveryDate?: string;
}
