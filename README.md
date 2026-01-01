<a id="readme-top"></a>

<div align="center">
  <h3 align="center">🔗 Mini Link</h3>
  <p align="center">
    URL shortener API with auth, MongoDB, and Redis cache.
    <br />
    <a href="#documentation"><strong>Explore the docs</strong></a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#server-structure">Server Structure</a></li>
    <li><a href="#cache-redis">Cache (Redis)</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#examples">Examples</a></li>
    <li><a href="#build">Build</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Simple URL shortener with JWT auth, link management, and cached redirects.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- Express
- TypeScript
- MongoDB (Mongoose)
- Redis
- Zod

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (MongoDB + Redis)

### Installation

```bash
pnpm install
```

Start MongoDB + Redis:

```bash
docker compose up -d
```

Create a `.env` file:

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

Run the server:

```bash
pnpm dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Cache (Redis)

Redirects are cached in Redis to reduce DB reads. Missing slugs are cached briefly.

Cache invalidation:
- Found slug: 24h
- Missing slug: 60s

No manual invalidation is implemented yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Endpoints

| Method | Path               | Auth      | Description                  |
| ------ | ------------------ | --------- | ---------------------------- |
| POST   | /api/auth/register | Public    | Create a new user account    |
| POST   | /api/auth/login    | Public    | Authenticate and return JWT  |
| GET    | /api/me/links      | Bearer    | List links for current user  |
| POST   | /api/me/links      | Bearer    | Create a new short link      |
| GET    | /:slug             | Public    | Redirect to the original URL |
| GET    | /docs              | Public    | API docs (Scalar)            |
| GET    | /openapi.json      | Public    | OpenAPI document             |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Documentation

- OpenAPI JSON: `GET /openapi.json`
- Scalar UI: `GET /docs`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Build

```bash
pnpm build
pnpm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Collaborators

Special thanks to everyone who contributed to this project.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/nicolasteofilo/">
        <img src="https://github.com/nicolasteofilo.png" width="100px;" alt="Nicolas Teofilo Profile Picture" /><br />
        <sub><b>Nicolas Teofilo</b></sub>
      </a>
    </td>
  </tr>
</table>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contribute

1. `git clone https://github.com/nicolasteofilo/mini-link.git`
2. `git checkout -b feature/NAME`
3. Follow commit patterns
4. Open a Pull Request explaining the change and add screenshots if needed

Helpful docs:

- [How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)
- [Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

- LinkedIn: https://www.linkedin.com/in/nicolasteofilo/
- Website: https://nicolasteofilo.com.br
- Email: nicolasteofilodecastro@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
