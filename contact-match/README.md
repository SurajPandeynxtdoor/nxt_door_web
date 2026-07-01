# Contact Match

A standalone app that, **with the user's permission**, reads their phone
contacts and finds the mobile numbers **two users have in common**.

It covers both flows you asked for:

1. **Mutual numbers** — given two registered users, show which numbers appear in
   *both* of their contact lists.
2. **Friends on the app** — show which of *my* contacts are already registered
   users.

## Privacy model (important)

Raw phone numbers **never leave the device in readable form**.

- On-device, every contact number is normalized to E.164
  (`+91 98765 43210` → `+919876543210`) and hashed with
  `SHA-256(pepper : e164)`.
- Only the resulting 64-char hex hashes are uploaded.
- The server stores **only hashes** and computes matches by intersecting hash
  sets. It can return *that* two users share N numbers, and even which hashes,
  but it cannot recover the numbers themselves. Each client maps a returned
  hash back to a contact name using a lookup table it keeps **locally**.
- A shared application `pepper` blocks trivial rainbow-table lookups against the
  database. (Phone numbers are low-entropy, so this is defense-in-depth, not a
  guarantee against a malicious server operator — see "Hardening" below.)

## Tech stack

| Part    | Stack                                             |
| ------- | ------------------------------------------------- |
| Mobile  | Expo (React Native) + TypeScript                  |
| Contacts| `expo-contacts` (native iOS/Android permission)   |
| Hashing | `expo-crypto` (SHA-256, on-device)                |
| Backend | Node + Express + TypeScript                        |
| Storage | SQLite via `better-sqlite3` (hashes only)          |
| Phone   | `libphonenumber-js` (E.164 normalization)          |

## Layout

```
contact-match/
├── server/          Express + SQLite backend (stores only hashes)
│   └── src/
│       ├── index.ts   HTTP API
│       ├── db.ts      SQLite schema + queries
│       └── phone.ts   normalize + hash helpers
└── mobile/          Expo React Native app
    ├── App.tsx        UI (register → sync → match)
    └── src/lib/
        ├── contacts.ts  permission + read + hash on-device
        ├── hash.ts      normalize + SHA-256
        ├── api.ts       backend client
        └── config.ts    API base URL
```

## Run the backend

```bash
cd server
npm install
CONTACT_MATCH_PEPPER="choose-a-strong-secret" npm run dev
# listens on http://localhost:4000
```

Environment variables:

| Var                          | Default            | Purpose                                   |
| ---------------------------- | ------------------ | ----------------------------------------- |
| `PORT`                       | `4000`             | HTTP port                                 |
| `CONTACT_MATCH_PEPPER`       | `dev-pepper-…`     | Secret mixed into every hash              |
| `CONTACT_MATCH_DEFAULT_COUNTRY` | `IN`            | Country for local-format numbers          |
| `CONTACT_MATCH_DB`           | `./contact-match.db` | SQLite file path                        |

## Run the mobile app

```bash
cd mobile
npm install
npm start           # then press "a" (Android) or "i" (iOS)
```

Point the app at your backend by editing `mobile/src/lib/config.ts` or setting
`EXPO_PUBLIC_API_URL`:

- Android emulator → `http://10.0.2.2:4000`
- iOS simulator → `http://localhost:4000`
- Physical device → `http://<your-LAN-IP>:4000`

The app fetches the pepper + default country from the server's `/config` so
on-device hashes match the server's expectations.

## API

| Method | Path                              | Purpose                                  |
| ------ | --------------------------------- | ---------------------------------------- |
| GET    | `/config`                         | Pepper + default country for the client  |
| POST   | `/users/register`                 | Register with name + own phone           |
| POST   | `/users/:id/contacts`             | Upload contact hashes (replaces set)     |
| GET    | `/users/:id/friends-on-app`       | Contacts who are registered users        |
| GET    | `/users/:id/mutual/:otherId`      | Mutual numbers between two users         |

## How to demo two users matching

1. Register user A (get their ID).
2. Register user B on another device/emulator (get their ID).
3. On each, tap **Grant permission & sync**.
4. On A, go to section 4, paste B's ID, tap **Show mutual contacts** — you'll
   see the count and (for numbers A holds) the matching names.

## Hardening (before production)

This is a working reference implementation. For production you would want:

- **Authentication** — verify phone ownership via OTP; gate `/config` and all
  endpoints behind a session token so users can only read their own matches and
  can only compute mutual sets with users who have consented.
- **Rate limiting** — hash-set uploads and mutual lookups enable enumeration;
  throttle and cap set sizes.
- **Private set intersection (PSI)** — for stronger privacy than salted hashes,
  use a cryptographic PSI protocol so even the server never sees the full hash
  sets in the clear.
- **Consent for mutual lookups** — require both users to opt in before their
  contact lists can be compared.
- **Data retention** — let users delete their uploaded hashes; expire stale data.
