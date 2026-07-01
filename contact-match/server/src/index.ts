import express from "express";
import cors from "cors";
import { z } from "zod";
import {
  createUser,
  getUser,
  replaceContactHashes,
  getContactHashes,
  findRegisteredContacts,
  User,
} from "./db";
import { normalizeAndHash, PHONE_PEPPER, DEFAULT_COUNTRY } from "./phone";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = Number(process.env.PORT || 4000);

const publicUser = (u: User) => ({ id: u.id, displayName: u.display_name });

/**
 * Client config. The mobile app calls this on launch so on-device hashing uses
 * the same pepper + default country as the server. (In production you would
 * gate this behind auth; for this reference app it is open.)
 */
app.get("/config", (_req, res) => {
  res.json({ pepper: PHONE_PEPPER, defaultCountry: DEFAULT_COUNTRY });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Register (or re-register) a user with their own phone number.
 * The number is normalized + hashed on the SERVER here only as a convenience so
 * the app can send a raw number at signup; contact lists are always hashed
 * on-device and never sent raw.
 */
const registerSchema = z.object({
  displayName: z.string().min(1).max(80),
  phone: z.string().min(3).max(32),
  country: z.string().length(2).optional(),
});

app.post("/users/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { displayName, phone, country } = parsed.data;
  const phoneHash = normalizeAndHash(phone, (country as never) ?? undefined);
  if (!phoneHash) return res.status(400).json({ error: "invalid_phone" });

  const user = createUser(displayName, phoneHash);
  res.json(publicUser(user));
});

/**
 * Upload the caller's contact-list hashes. The app has already normalized each
 * number to E.164 and hashed it with the shared pepper; the server only ever
 * receives opaque hex digests.
 */
const uploadSchema = z.object({
  hashes: z.array(z.string().regex(/^[a-f0-9]{64}$/)).max(20000),
});

app.post("/users/:id/contacts", (req, res) => {
  const user = getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "user_not_found" });

  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const unique = Array.from(new Set(parsed.data.hashes));
  const count = replaceContactHashes(user.id, unique);
  res.json({ stored: count });
});

/** Use case #2: which of my contacts are registered users of the app? */
app.get("/users/:id/friends-on-app", (req, res) => {
  const user = getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "user_not_found" });
  res.json({ friends: findRegisteredContacts(user.id).map(publicUser) });
});

/**
 * Use case #1: mutual numbers shared between two users' contact lists.
 * Returns the COUNT and the intersecting hashes (opaque) — the server cannot
 * reveal the underlying numbers, but each client can map a returned hash back
 * to a name it holds locally.
 */
app.get("/users/:id/mutual/:otherId", (req, res) => {
  const a = getUser(req.params.id);
  const b = getUser(req.params.otherId);
  if (!a || !b) return res.status(404).json({ error: "user_not_found" });

  const setA = getContactHashes(a.id);
  const setB = getContactHashes(b.id);
  const intersection: string[] = [];
  for (const h of setA) if (setB.has(h)) intersection.push(h);

  res.json({
    otherUser: publicUser(b),
    mutualCount: intersection.length,
    mutualHashes: intersection,
  });
});

app.listen(PORT, () => {
  console.log(`contact-match server listening on http://localhost:${PORT}`);
});
