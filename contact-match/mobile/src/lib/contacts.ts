import * as Contacts from "expo-contacts";
import { CountryCode } from "libphonenumber-js";
import { hashE164, normalizePhone } from "./hash";

export interface LocalContact {
  name: string;
  /** hash -> so we can map a server-returned mutual hash back to a name */
  hashes: string[];
}

export interface ScanResult {
  /** Every unique contact hash to upload to the server. */
  hashes: string[];
  /** Reverse map: contact hash -> display name, kept only on-device. */
  hashToName: Record<string, string>;
  /** Number of contacts that produced at least one valid number. */
  matchedContacts: number;
}

/**
 * Ask for contacts permission, read the address book, normalize + hash every
 * phone number on-device. Returns null if permission is denied.
 */
export async function scanContacts(
  pepper: string,
  defaultCountry: CountryCode
): Promise<ScanResult | null> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") return null;

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });

  const hashSet = new Set<string>();
  const hashToName: Record<string, string> = {};
  let matchedContacts = 0;

  for (const contact of data) {
    const name = contact.name || "Unknown";
    let contactHadNumber = false;

    for (const phone of contact.phoneNumbers ?? []) {
      const raw = phone.number;
      if (!raw) continue;
      const e164 = normalizePhone(raw, defaultCountry);
      if (!e164) continue;
      const h = await hashE164(e164, pepper);
      hashSet.add(h);
      // First name wins for a given number; avoids clobbering on shared numbers.
      if (!hashToName[h]) hashToName[h] = name;
      contactHadNumber = true;
    }

    if (contactHadNumber) matchedContacts++;
  }

  return { hashes: Array.from(hashSet), hashToName, matchedContacts };
}
