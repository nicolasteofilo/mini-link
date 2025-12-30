# MiniLink

A minimal, production-minded **URL Shortener** with JWT auth and OpenAPI docs.

---

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run MongoDB with Docker](#run-mongodb-with-docker)
  - [Install & Run](#install--run)
- [API Docs](#api-docs)
  - [Routes](#routes)
- [Examples (cURL)](#examples-curl)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- ✅ **Register / Login** with email + password
- ✅ **JWT Auth** (Bearer token)
- ✅ **Create short links** and associate them to the authenticated user
- ✅ **Redirect** via `slug`
- ✅ **Request validation** using Zod
- ✅ **MongoDB persistence** using Mongoose
- ✅ **OpenAPI docs** at `/docs`
- ✅ **Docker Compose** for local database setup

---

## Tech Stack

- **Runtime:** Node.js
- **HTTP Framework:** Hono
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **Auth:** JWT
- **Dev runner:** `tsx`

---

## Project Structure
```
.
├─ docker-compose.yml
├─ .env
├─ src/
  │  ├─ config/            # env parsing (Zod)
  │  ├─ controllers/       # route handlers (Auth/Links)
  │  ├─ db/                # mongoose connection + models
  │  ├─ http/schemas/      # Zod schemas (request validation)
  │  ├─ lib/               # helpers (slug generation, etc.)
  │  ├─ middlewares/       # auth middleware (JWT)
  │  ├─ routes/            # route grouping
  │  └─ index.ts           # app bootstrap (connect DB + serve)
└─ package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **pnpm**
- **Docker** + **Docker Compose**

### Environment Variables

Create a `.env` file at the project root:

```env
NODE_ENV=development
PORT=3000

# Mongo
MONGO_URI=mongodb://app:app123@localhost:27017/url_shortener?authSource=url_shortener

# Public base URL used to build the "shortUrl" in responses.
BASE_URL=http://localhost:3000/api

# Slug / Auth
SLUG_SECRET=change-me-to-a-long-random-string
JWT_SECRET=change-me-to-a-very-long-random-string
JWT_EXPIRES_IN=7d
```

### Run MongoDB with Docker

From the repo root:

```bash
docker compose up -d
```

Check logs:

```bash
docker logs -f mongo
```

### Install & Run

```bash
pnpm install
pnpm dev
```

Server should be available at `http://localhost:3000`.

---

## API Docs

- **OpenAPI JSON:** `http://localhost:3000/openapi.json`
- **API UI:** `http://localhost:3000/docs`

### Routes

All endpoints below assume your API is mounted under `/api`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| POST | `/api/shorten` | Bearer | Create a short link |
| GET | `/api/:slug` | Public | Redirect to original URL |

---

## Examples (cURL)

### 1) Register
```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678","username":"test"}'
```

### 2) Shorten (Protected)
```bash
TOKEN="PASTE_JWT_HERE"

curl -s -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"longUrl":"https://roadmap.sh/backend"}'
```

---

## Scripts

Typical scripts (your `package.json` may differ):

- `pnpm dev` → runs with `tsx watch`
- `pnpm build` → TypeScript build
- `pnpm start` → runs the compiled output

---

## Troubleshooting

### `shortUrl` doesn’t open / 404 on redirect
Make sure `BASE_URL` includes `/api` for the default routing setup:

- Redirect is `GET /api/:slug` → `BASE_URL=http://localhost:3000/api`

### Mongo auth errors
If you changed docker credentials after the volume existed, reset your volume:

```bash
docker compose down -v
docker compose up -d
```

### Slug collision (409)
`slug` is `unique` in Mongo. Collisions should be extremely rare, but if it happens the API may return `409` (try again).

---

## Roadmap

- [ ] List user links (`GET /api/me/links`)
- [ ] Expiration (`expiresAt`) + soft delete (`isActive`)
- [ ] Redis cache for ultra-fast redirects
- [ ] Click analytics (async worker / queue)
- [ ] Rate limiting + abuse protection

---

## License

See `LICENSE`.
