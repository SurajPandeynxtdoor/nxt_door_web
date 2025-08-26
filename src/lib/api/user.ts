import type { Address, User } from "@/types/auth";

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

export interface ProfileResponse {
  error: boolean;
  message: string;
  user: User;
}

export async function getProfile() {
  return authFetch<ProfileResponse>("/api/profile", { method: "GET" });
}

// Add new address
export async function addAddress(addressData: Omit<Address, "_id">) {
  return authFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ address: addressData }),
  });
}

// Update existing address
export async function updateAddress(addressId: string, addressData: Address) {
  return authFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ address: { ...addressData, addressId } }),
  });
}

// Delete address by sending updated array
export async function deleteAddress(
  addressId: string,
  userAddresses: Address[]
) {
  const updated = userAddresses.filter((a) => a._id !== addressId);
  return authFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ address: updated }),
  });
}

// Set default address
export async function setDefaultAddress(addressId: string) {
  return authFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ address: { addressId, isDefault: true } }),
  });
}
