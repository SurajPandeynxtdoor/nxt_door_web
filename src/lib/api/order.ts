// src/lib/api/order.ts
import type { Address } from "@/types/auth";
import type { Order } from "@/types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

async function handleJSON<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  const parse = ct.includes("application/json")
    ? () => res.json()
    : async () => ({ message: await res.text() });
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await parse();
    throw new Error(
      data?.message || `Request failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

async function authFetch<T>(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(buildUrl(path), {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJSON<T>(res);
}

interface OrderItemInput {
  _product: string;
  quantity: number;
  price: number;
  caseSize: { size: number; price: number; offeredPrice: number };
  totalUnits: number;
}

export interface OrderFormData {
  items: OrderItemInput[];
  totalAmount: number;
  totalUnits: number;
  totalCases: number;
  paymentMethod: "cod" | "onlineTransfer";
  shippingAddress: { addressId?: string; snapshot?: Omit<Address, "_id"> };
}

export interface CreateOrderResponse {
  error: boolean;
  message: string;
  order: { _id: string };
}

export async function createOrder(
  orderData: OrderFormData
): Promise<CreateOrderResponse> {
  return authFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export interface UserOrdersResponse {
  error: boolean;
  message: string;
  orders: Order[];
}

export async function getUserOrders(): Promise<UserOrdersResponse> {
  return authFetch<UserOrdersResponse>("/api/orders/user", { method: "GET" });
}

export interface OrderDetailResponse {
  error: boolean;
  message: string;
  order: Order;
}

export async function getOrder(id: string): Promise<OrderDetailResponse> {
  return authFetch<OrderDetailResponse>(`/api/orders/${id}`, { method: "GET" });
}
