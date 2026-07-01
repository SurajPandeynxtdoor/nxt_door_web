import { API_URL } from "./config";

export interface AppConfig {
  pepper: string;
  defaultCountry: string;
}

export interface PublicUser {
  id: string;
  displayName: string;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getConfig: () => req<AppConfig>("/config"),

  register: (displayName: string, phone: string, country?: string) =>
    req<PublicUser>("/users/register", {
      method: "POST",
      body: JSON.stringify({ displayName, phone, country }),
    }),

  uploadContacts: (userId: string, hashes: string[]) =>
    req<{ stored: number }>(`/users/${userId}/contacts`, {
      method: "POST",
      body: JSON.stringify({ hashes }),
    }),

  friendsOnApp: (userId: string) =>
    req<{ friends: PublicUser[] }>(`/users/${userId}/friends-on-app`),

  mutual: (userId: string, otherId: string) =>
    req<{ otherUser: PublicUser; mutualCount: number; mutualHashes: string[] }>(
      `/users/${userId}/mutual/${otherId}`
    ),
};
