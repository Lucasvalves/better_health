# API

REST API for Better Health. It owns users, patients, doctors, specialties, availability, and appointments, and enforces the scheduling rules for every client. See the [root README](../README.md) for how it fits into the system.

**Stack:** Node.js, Express, TypeScript, Prisma, SQLite, JWT, Swagger, Jest, Supertest.

---

## Getting started

Copy `.env.default` to `.env` and fill it in:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string, e.g. `file:./dev.db` |
| `ACCESS_KEY_TOKEN` | Secret used to sign and verify JWTs |
| `PORT` | HTTP port (defaults to `3333`) |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | S3 credentials, only needed for avatar upload |

```bash
npm install
npx prisma migrate deploy
npm run dev
```

The server starts at [http://localhost:3333](http://localhost:3333) with hot reload. Swagger is at [/v1/docs](http://localhost:3333/v1/docs).

Create the first account with `POST /users`, then sign in with `POST /users/auth` to get a token.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server with `ts-node-dev` |
| `npm run build` | `prisma generate` and TypeScript build to `dist/` |
| `npm start` | Applies migrations and runs `dist/server.js` |
| `npm run migrate` | `prisma migrate deploy` |

---

## How it works

### Layers

```
src/
├── routes/         # Endpoints and Swagger annotations
├── controllers/    # HTTP input and output
├── services/       # Business rules
├── repositories/   # Data access through Prisma
├── interfaces/     # Input types
├── middlewares/    # AuthMiddleware (JWT)
├── config/         # S3 and Multer setup
├── database/       # Prisma client
├── utils/          # Swagger setup and date helpers
└── tests/          # Jest + Supertest
```

A request flows `route → controller → service → repository`. Keep business rules in services; controllers only translate HTTP.

To add a resource, create its route, controller, service, and repository, register the route in `src/server.ts`, and add Swagger annotations above the route.

### Authentication

`POST /users/auth` returns a JWT signed with `ACCESS_KEY_TOKEN`. Protected routes expect `Authorization: Bearer <token>`. `AuthMiddleware` verifies it and exposes the user id as `request.user_id`.

### Errors

Missing or invalid tokens return `401`. Any other `Error` thrown in a service is returned as `400` with `{ "message": "..." }` by the error handler in `src/server.ts`.

### Data model

Defined in `prisma/schema.prisma`: `Users`, `Patients`, `Doctors`, `Specialties`, `Times`, and `Appointments`.

- A **doctor** has one specialty.
- A **specialty** defines the appointment duration.
- **Times** are a doctor's availability: weekdays plus a start and end hour.
- An **appointment** links a patient, doctor, and specialty at a date.

After editing the schema, create a migration with `npx prisma migrate dev` and commit it.

### Appointment rules

Implemented in `src/services/AppointmentsServices.ts`.

**Create**

- The specialty and patient must exist.
- The doctor must provide the requested specialty.
- The doctor must have availability on that weekday.
- The appointment, from its start through the specialty duration, must fit inside one of the doctor's time ranges.
- It must not overlap another appointment of the same doctor.

**Update** repeats the overlap check against the doctor's other appointments, ignoring the appointment being edited.

**Available days** scans up to 365 days from the given date and returns the days with free slots for the specialty, per doctor. Slots are the doctor's time ranges split by the specialty duration, minus existing appointments.

### Endpoints

All routes require a token except `POST /users` and `POST /users/auth`. Request and response shapes are in Swagger.

| Resource | Endpoints |
| --- | --- |
| `/users` | `POST /` · `POST /auth` · `GET /` · `PUT /` |
| `/patients` | `POST /` · `GET /` · `GET /:id` · `POST /cpf/` · `PUT /:id` · `DELETE /:id` |
| `/doctors` | `POST /` · `GET /` · `GET /:id` · `POST /crm/` · `DELETE /:id` |
| `/specialties` | `POST /` · `GET /` · `GET /:id` |
| `/times` | `POST /` · `GET /` · `GET /specialties` · `DELETE /:id` |
| `/appointments` | `POST /` · `GET /filter` · `POST /available-days` · `POST /appointments-patient` · `PUT /:id` · `DELETE /:id` |

### Avatar upload

`PUT /users` accepts an `avatar_url` file (max 2 MB, held in memory by Multer) and uploads it to the `better-health` S3 bucket.

---

## Tests

```bash
npx jest
```

`npm test` is not configured. The suites in `src/tests/` call the real app through Supertest, so they use the database from `DATABASE_URL`, along with fixed ids and a fixed token that must match your data. Replace them with data from your own environment before relying on the results.

---

## Deployment

`buildspec.yaml` is an AWS CodeBuild spec (Node.js 22, Yarn). It runs `yarn install` and `yarn build`, and packages `dist/`, `package.json`, and `yarn.lock`. Keep `yarn.lock` in sync with `package.json` when changing dependencies.
