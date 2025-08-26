export interface AuthResponse {
  error: boolean;
  message: string;
  token?: string;
}

import type { User } from "@/types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}

async function handleJSON<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const parse = contentType.includes("application/json")
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

export async function initiatePhoneAuth(phone: string): Promise<AuthResponse> {
  const url = buildUrl("/api/initiate-phone-auth");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
    cache: "no-store",
  });
  return handleJSON<AuthResponse>(res);
}

export async function verifyPhoneOTP(
  phone: string,
  otp: string
): Promise<AuthResponse> {
  const url = buildUrl("/api/verify-phone-otp");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
    cache: "no-store",
  });
  return handleJSON<AuthResponse>(res);
}

export interface ProfileResponse {
  error: boolean;
  message: string;
  user: User;
}

export async function fetchProfile(): Promise<ProfileResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const url = buildUrl("/api/profile");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  return handleJSON<ProfileResponse>(res);
}
