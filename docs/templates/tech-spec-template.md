# Technical Specification — [Product Name]

> **Instructions:** fill this document before starting BLOCK-1.
> Precision matters here more than completeness — it is better to have 5 correct endpoints than 20 approximate ones.
> Claude and Codex use this to generate code with the right names, types, and patterns.
> Update as the project evolves — decisions made in blocks should be reflected here.

**Version:** 0.1
**Last updated:** YYYY-MM-DD

---

## Tech stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend | [e.g. React, Vue, Svelte] | [e.g. 18.x] | [e.g. Vite, TypeScript strict] |
| Backend | [e.g. Express, FastAPI, Go] | | |
| Database | [e.g. PostgreSQL via Prisma, SQLite, MongoDB] | | |
| Auth | [e.g. JWT cookies, NextAuth, Clerk] | | |
| Hosting / Runtime | [e.g. Replit, Vercel, Fly.io] | | |
| CSS / UI library | [e.g. Tailwind, shadcn/ui, MUI] | | |
| Testing | [e.g. Vitest + Playwright] | | |
| Other | [e.g. OpenAI SDK, Stripe, Resend] | | |

---

## Architecture overview

*Describe how the parts connect. ASCII diagram or prose — whatever is clearest.*

```
[Client: React SPA]
        │  HTTP / REST
        ▼
[Server: Express API]
        │  Prisma ORM
        ▼
[DB: PostgreSQL]

External services:
  → [OpenAI API]: [which feature uses it]
  → [Service X]: [which feature uses it]
```

**Key architectural decisions already made:**
- [Decision 1 — e.g. "SPA with REST API — not SSR — because coaches use the app as a tool, not a content site"]
- [Decision 2 — e.g. "JWT in httpOnly cookies — not localStorage — for XSS resistance"]
- [Decision 3]

*These decisions are final for this project. Claude and Codex do not revisit them.*

---

## Data model

*List every entity with its fields, types, and relationships. Precision required — Codex uses these exact names.*

### [Entity 1 — e.g. Coach]

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` (UUID) | ✅ | Primary key |
| `email` | `string` | ✅ | Unique |
| `name` | `string` | ✅ | |
| `createdAt` | `DateTime` | ✅ | |
| [field] | [type] | | |

**Relations:**
- Has many `[Entity2]`

### [Entity 2]

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` (UUID) | ✅ | |
| `[foreignKey]Id` | `string` | ✅ | FK to [Entity1] |
| [field] | [type] | | |

**Relations:**
- Belongs to `[Entity1]`

---

## API contracts

*List every endpoint the frontend calls. Method, path, auth required, request/response shape.*

> **Convention:** all responses are JSON. Errors follow `{ error: string }`. Auth via `[e.g. httpOnly cookie / Bearer token]`.

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | No | [e.g. email + password → sets cookie] |
| `POST` | `/auth/logout` | Yes | Clears session |
| `GET` | `/auth/me` | Yes | Returns current user |

### [Resource 1 — e.g. Clients]

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/clients` | Yes | List all clients for authenticated coach |
| `POST` | `/api/clients` | Yes | Create client |
| `GET` | `/api/clients/:id` | Yes | Get single client |
| `PUT` | `/api/clients/:id` | Yes | Update client |
| `DELETE` | `/api/clients/:id` | Yes | Delete client |

**Request body — `POST /api/clients`:**
```json
{
  "name": "string",
  "email": "string (optional)"
}
```

**Response — `GET /api/clients`:**
```json
[
  {
    "id": "string",
    "name": "string",
    "createdAt": "ISO date string"
  }
]
```

### [Resource 2]

*Add sections as needed.*

---

## Key technical decisions

*Why things are the way they are. Prevents Claude from "improving" them to something different.*

| Decision | Choice made | Alternatives rejected | Reason |
|---|---|---|---|
| [Topic] | [What] | [What else was considered] | [Why this one] |
| Auth strategy | JWT httpOnly cookies | localStorage, sessions | XSS resistance |
| ORM | Prisma | Drizzle, raw SQL | Type safety + migrations |

---

## External integrations

| Service | Used for | SDK / method | Rate limits | Error behavior |
|---|---|---|---|---|
| [Service] | [Feature] | [e.g. official SDK] | [e.g. 60 req/min] | [e.g. fallback to mock] |

---

## Environment variables

> Full list is in `.env.example`. This table describes each variable's purpose.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing auth tokens — min 32 chars |
| `[VAR]` | ✅ / optional | [description] |
