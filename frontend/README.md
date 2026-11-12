# Frontend

Web interface for Better Health clinic staff. It talks only to the [API](../api/README.md); see the [root README](../README.md) for how it fits into the system.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Sass, TanStack Query, Axios, Zod, Jest, React Testing Library.

---

## Getting started

Copy `.env.default` to `.env` and set the API address:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BETTER_HEALTH_URL` | Base URL of the API, e.g. `http://localhost:3333` |

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page redirects to `/authentication`. The API must be running.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Jest |

---

## How it works

### Pages

| Route | Purpose |
| --- | --- |
| `/authentication` | Sign in and create an account |
| `/appointments` | Book an appointment |
| `/search-appointments` | Find, edit, and cancel a patient's appointments |
| `/schedule` | Define a doctor's availability |
| `/register-doctor`, `/register-patient`, `/register-specialty` | Registration forms |
| `/edit-profile` | Update profile data |

All routes except `/authentication` are protected. `src/middleware.ts` redirects to `/authentication` when the `token` cookie is missing. The cookie is set by the route handler at `src/app/api/auth/route.ts` after a successful login. Route paths are centralized in `src/shared/enums/enumsRoutes.tsx`.

### Structure

```
src/
├── app/              # Pages; (protect)/ holds the authenticated area
├── data/             # Services that call the API
├── domain/           # Models and Zod validations
├── presentation/     # Shared components and providers
├── infrastructure/   # HTTP client and contracts
├── shared/           # Enums and helpers
└── test/             # Mocks and test utilities
```

### Feature pattern (MVVM)

Each page folder under `app/` is split into three files:

- `*-model` — state, queries, and mutations for the feature, built on injected services
- `*-view-model` — creates the services and the HTTP client and passes the model's output to the view
- `*-view` — presentational component

Example: `app/(protect)/appointments/` has `appointments-model.ts`, `appointments-view-model.tsx`, and `appointments-view.tsx`, with `page.tsx` rendering the view model.

### Data layer

Each API call is a small service class in `src/data/<resource>-service/`, created with a static factory that receives an `IHttpClient`. `HttpClient` (Axios) prepends `NEXT_PUBLIC_API_BETTER_HEALTH_URL` to every endpoint. Services depend on the `IHttpClient` contract rather than on Axios directly, so tests can replace them with in-memory implementations.

To add an API call, create the service and its test in `src/data/`, then inject it into the feature's view model.

### Validation and UI

Forms are validated with Zod schemas in `src/domain/validations/`. Shared inputs and buttons live in `src/presentation/components/`. Styles are Sass modules next to each component. Formatting follows `.prettierrc` and `.editorconfig`.

---

## Tests

```bash
npm test
```

Jest runs in `jsdom` with `ts-jest`. Tests sit next to the code they cover. Page tests render the view with in-memory services, and service tests mock Axios (`httpClientMockSuccess` and `httpClientMockFail`) and assert the request that was sent. Shared mocks are in `src/test/mock/`.

Known state: the `search-appointments` suite currently fails (8 tests); the remaining suites pass.
