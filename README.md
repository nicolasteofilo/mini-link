# MiniLink Server

Minimal URL shortener API built with Hono, TypeScript, and MongoDB.

## Summary

MiniLink exposes a small HTTP API to create short links and redirect users to the original URL. Slugs are generated server-side and stored in MongoDB.

## Features

- Create short URLs with a single POST request
- Redirect to the original URL via slug
- MongoDB persistence with Mongoose
- Input validation with Zod
- Simple CORS setup for `/api/*`

## Tech Stack

- Node.js + TypeScript
- Hono (`@hono/node-server`)
- MongoDB + Mongoose
- Zod
- Docker Compose (optional local Mongo)

## Requirements

- Node.js 20+
- MongoDB 7+ (or Docker)

## Getting Started

1) Install dependencies

```bash
pnpm install
```

2) Configure environment variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://dev-mongo:dev-mongo-password@localhost:27017/mini_link?authSource=admin
MONGO_ROOT_USER=dev-mongo
MONGO_ROOT_PASSWORD=dev-mongo-password
BASE_URL=http://localhost:3000/api
```

Notes:
- `MONGO_URI` should include a database name (example: `/mini_link`).
- `BASE_URL` is used to build the `shortUrl` response.

3) Start MongoDB (optional if you already have one running)

```bash
docker compose up -d
```

4) Run the API

```bash
pnpm dev
```

The server starts at `http://localhost:3000`.

## Scripts

- `pnpm dev` - run in watch mode
- `pnpm build` - compile TypeScript to `dist/`
- `pnpm start` - run compiled server

## API Endpoints

Base path: `/api`

### `GET /api`

Simple health message.

Response:

```text
Welcome to MiniLink!
```

### `POST /api/shorten`

Create a short link.

Request body:

```json
{
  "longUrl": "https://example.com/page"
}
```

Responses:
- `200` with the generated short URL
- `400` invalid body
- `409` slug already in use
- `500` internal error

Example:

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com/page"}'
```

Success response:

```json
{
  "shortUrl": "http://localhost:3000/api/Ab3dE9kL",
  "longUrl": "https://example.com/page"
}
```

### `GET /api/:slug`

Redirect to the original URL.

Responses:
- `302` redirect
- `404` link not found

Example:

```bash
curl -i http://localhost:3000/api/Ab3dE9kL
```

## Data Model

The `Link` document includes:

- `slug` (unique string)
- `longUrl` (original URL)
- `createdAt`, `updatedAt` (timestamps)
- `isActive` (boolean)

## Contributing

1) Fork the repo and create a feature branch
2) Make your changes with clear commits
3) Ensure the API still runs locally
4) Open a pull request with a concise description

## Author

Nicolas Teofilo de Castro

## License

MIT. See `LICENSE.md`.
