# Mini Link API

Minimal URL shortener API built with Express and TypeScript, with MongoDB for persistence and Redis for cache.

## Index

- [Mini Link API](#mini-link-api)
  - [Index](#index)
  - [Stack](#stack)
  - [Server Structure](#server-structure)
  - [Cache (Redis)](#cache-redis)
    - [Cache invalidation](#cache-invalidation)
  - [Setup](#setup)
  - [Environment](#environment)
  - [Run](#run)
  - [Endpoints](#endpoints)
  - [Examples](#examples)
  - [Build](#build)

## Stack

- Express + TypeScript
- MongoDB (Mongoose)
- Redis (cache)
- Zod (validation)

## Server Structure

```text
src/
  cache/
  config/
  controllers/
  db/
  docs/
  http/schemas/
  lib/
  middlewares/
  routes/
  index.ts
```

## Cache (Redis)

The redirect endpoint caches slug lookups in Redis to avoid repeated DB hits. Missing slugs are cached briefly to reduce repeated queries.

### Cache invalidation

Cache entries expire by TTL only:
- Found slug: 24h
- Missing slug: 60s

## Setup

```bash
pnpm install
```

Start MongoDB + Redis:

```bash
docker compose up -d
```

## Environment

Create a `.env` with:

```bash
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mini-link
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=admin
BASE_URL=http://localhost:3000
JWT_SECRET=replace_with_32_chars_min
SLUG_SECRET=replace_with_32_chars_min
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

## Run

```bash
pnpm dev
```

## Endpoints

| Method | Path               | Auth      | Description                  |
| ------ | ------------------ | --------- | ---------------------------- |
| POST   | /api/auth/register | Public    | Create a new user account    |
| POST   | /api/auth/login    | Public    | Authenticate and return JWT  |
| GET    | /api/me/links      | Bearer    | List links for current user  |
| POST   | /api/me/links      | Bearer    | Create a new short link      |
| GET    | /:slug             | Public    | Redirect to the original URL |

## Examples

Create short link:

```bash
curl -X POST http://localhost:3000/api/me/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

Redirect:

```bash
curl -I http://localhost:3000/abc12345
```

## Build

```bash
pnpm build
pnpm start
```
