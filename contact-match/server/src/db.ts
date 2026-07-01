import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = process.env.CONTACT_MATCH_DB || path.join(process.cwd(), "contact-match.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    -- hash of the user's OWN phone number. Lets other users discover them.
    phone_hash   TEXT NOT NULL UNIQUE,
    created_at   INTEGER NOT NULL
  );

  -- One row per (user, contact-hash). Stores ONLY the salted hash of each
  -- contact number the user uploaded, never the raw number or name.
  CREATE TABLE IF NOT EXISTS contact_hashes (
    user_id      TEXT NOT NULL,
    contact_hash TEXT NOT NULL,
    PRIMARY KEY (user_id, contact_hash),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_contact_hash ON contact_hashes(contact_hash);
`);

export interface User {
  id: string;
  display_name: string;
  phone_hash: string;
  created_at: number;
}

export function createUser(displayName: string, phoneHash: string): User {
  const existing = db
    .prepare("SELECT * FROM users WHERE phone_hash = ?")
    .get(phoneHash) as User | undefined;
  if (existing) {
    // Re-registration with the same number: keep the id, refresh the name.
    db.prepare("UPDATE users SET display_name = ? WHERE id = ?").run(displayName, existing.id);
    return { ...existing, display_name: displayName };
  }
  const user: User = {
    id: crypto.randomUUID(),
    display_name: displayName,
    phone_hash: phoneHash,
    created_at: Date.now(),
  };
  db.prepare(
    "INSERT INTO users (id, display_name, phone_hash, created_at) VALUES (@id, @display_name, @phone_hash, @created_at)"
  ).run(user);
  return user;
}

export function getUser(id: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

/** Replace the full set of contact hashes for a user. */
export function replaceContactHashes(userId: string, hashes: string[]): number {
  const del = db.prepare("DELETE FROM contact_hashes WHERE user_id = ?");
  const ins = db.prepare(
    "INSERT OR IGNORE INTO contact_hashes (user_id, contact_hash) VALUES (?, ?)"
  );
  const tx = db.transaction((hs: string[]) => {
    del.run(userId);
    for (const h of hs) ins.run(userId, h);
  });
  tx(hashes);
  return hashes.length;
}

export function getContactHashes(userId: string): Set<string> {
  const rows = db
    .prepare("SELECT contact_hash FROM contact_hashes WHERE user_id = ?")
    .all(userId) as { contact_hash: string }[];
  return new Set(rows.map((r) => r.contact_hash));
}

/**
 * Use case #2: "find friends already on the app".
 * Given the caller's contact hashes, return the registered users whose OWN
 * phone hash appears among those contacts.
 */
export function findRegisteredContacts(userId: string): User[] {
  return db
    .prepare(
      `SELECT u.* FROM users u
       JOIN contact_hashes c ON c.contact_hash = u.phone_hash
       WHERE c.user_id = ? AND u.id != ?`
    )
    .all(userId, userId) as User[];
}
