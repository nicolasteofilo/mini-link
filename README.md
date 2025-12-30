# MiniLink

A minimal, production-minded **URL Shortener** with **JWT authentication**.  
Create short links tied to a user account, store them in **MongoDB**, and redirect fast using the generated `slug`.

---

## Table of Contents

- [MiniLink](#minilink)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Run MongoDB with Docker](#run-mongodb-with-docker)
    - [Install \& Run](#install--run)
  - [API Reference](#api-reference)
    - [Auth](#auth)
      - [Register](#register)
      - [Login](#login)
    - [Links](#links)
      - [Create a short link (Protected)](#create-a-short-link-protected)
      - [Redirect (Public)](#redirect-public)
  - [Examples (cURL)](#examples-curl)
    - [1) Register](#1-register)
    - [2) Login](#2-login)
    - [3) Shorten (Protected)](#3-shorten-protected)
    - [4) Redirect](#4-redirect)
  - [Scripts](#scripts)
  - [Troubleshooting](#troubleshooting)
    - [`shortUrl` doesn’t open / 404 on redirect](#shorturl-doesnt-open--404-on-redirect)
    - [Mongo auth errors](#mongo-auth-errors)
    - [Slug collision (409)](#slug-collision-409)
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
- ✅ **Docker Compose** for local database setup

---

## Tech Stack

- **Runtime:** Node.js
- **HTTP Framework:** Hono (`@hono/node-server`)
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **Auth:** JWT
- **Dev runner:** `tsx`

---

## Project Structure

> This is the typical layout. Your repo may vary slightly.

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
│  ├─ routes/            # route grouping (optional)
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
# If your redirect route is GET /api/:slug, include "/api" here.
# If your redirect route is GET /:slug, use only the host.
BASE_URL=http://localhost:3000/api

# Slug / Auth
SLUG_SECRET=change-me-to-a-long-random-string
JWT_SECRET=change-me-to-a-very-long-random-string
JWT_EXPIRES_IN=7d
```

> **Important:** `BASE_URL` must match how your redirect endpoint is exposed.
> - Redirect at `GET /api/:slug` → `BASE_URL=http://localhost:3000/api`
> - Redirect at `GET /:slug` → `BASE_URL=http://localhost:3000/api`

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

Server should be available at:

- `http://localhost:3000`

---

## API Reference

All endpoints below assume your API is mounted under `/api`.

### Auth

#### Register
`POST /api/auth/register`

**Body**
```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

**Response**
```json
{
  "user": { "id": "USER_ID", "email": "user@example.com" },
  "token": "JWT_TOKEN"
}
```

#### Login
`POST /api/auth/login`

**Body**
```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

**Response**
```json
{
  "user": { "id": "USER_ID", "email": "user@example.com" },
  "token": "JWT_TOKEN"
}
```

---

### Links

#### Create a short link (Protected)
`POST /api/shorten`

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body**
```json
{
  "longUrl": "https://roadmap.sh/backend"
}
```

**Response**
```json
{
  "shortUrl": "http://localhost:3000/api/AbC123xY",
  "longUrl": "https://roadmap.sh/backend"
}
```

> The generated link is tied to the authenticated user (via `userId` in the database).

#### Redirect (Public)
`GET /api/:slug`

- Returns `302` redirect to the stored `longUrl`
- If not found, returns `404`

---

## Examples (cURL)

### 1) Register
```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

### 2) Login
```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

### 3) Shorten (Protected)
```bash
TOKEN="PASTE_JWT_HERE"

curl -s -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"longUrl":"https://roadmap.sh/backend"}'
```

### 4) Redirect
```bash
curl -I http://localhost:3000/api/AbC123xY
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
Make sure `BASE_URL` matches your redirect route:

- Redirect is `GET /api/:slug` → `BASE_URL=http://localhost:3000/api`
- Redirect is `GET /:slug` → `BASE_URL=http://localhost:3000`

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
- [ ] OpenAPI / Swagger docs

---

## License

See `LICENSE`.