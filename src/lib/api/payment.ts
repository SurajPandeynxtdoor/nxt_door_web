/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface RazorpayOrderResponse {
  error: boolean;
  message: string;
  data?: { orderId: string };
}

export interface VerifyPaymentResponse {
  error: boolean;
  message: string;
}

export async function createRazorpayOrder(
  orderId: string
): Promise<RazorpayOrderResponse> {
  return authFetch<RazorpayOrderResponse>("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<VerifyPaymentResponse> {
  return authFetch<VerifyPaymentResponse>("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });
}
