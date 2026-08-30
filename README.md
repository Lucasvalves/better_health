# Better Health

A system that simplifies the management of users, doctors, and patients, enabling efficient appointment scheduling in health clinics.

---

## About

Clinics often deal with scattered records, fragmented schedules, and manual booking. **Better Health** brings these operations into a single platform: registering professionals and patients, defining specialties and availability, and booking appointments based on real calendar slots.

The goal is to reduce day-to-day operational friction — less rework, fewer scheduling conflicts, and clearer visibility into who is available, when, and in which specialty.

---

## What it offers

| Area | Capability |
| --- | --- |
| **Authentication** | Login and protected sessions for internal areas |
| **Patients** | Patient registration and clinic linkage |
| **Doctors** | Professional registration with CRM and specialty |
| **Specialties** | Specialty registration and appointment duration |
| **Schedule** | Doctor availability by days and time ranges |
| **Appointments** | Create, view, edit, and cancel appointments |
| **Profile** | Edit the logged-in user's profile |

Typical workflow:

1. Register specialties and doctors
2. Configure availability (days and hours)
3. Register patients
4. Book appointments in available slots
5. Search, edit, or cancel appointments as needed

---

## Architecture

This repository is a monorepo with two main packages:

```
better_health/
├── api/        # Backend (Express + Prisma)
└── frontend/   # Frontend (Next.js)
```

### Backend (`api/`)

REST API built with **Node.js**, **Express**, and **TypeScript**, organized in layers:

- **Routes** → endpoint definitions  
- **Controllers** → HTTP input/output  
- **Services** → business rules  
- **Repositories** → data access via Prisma  

Persistence with **Prisma** and **SQLite**. Authentication via **JWT**. API docs with **Swagger**.

Core entities: `Users`, `Patients`, `Doctors`, `Specialties`, `Times`, and `Appointments`.

### Frontend (`frontend/`)

**Next.js (App Router)** app with **React** and **TypeScript**, following an **MVVM** pattern per feature (`model` / `view-model` / `view`) and a Clean Architecture–inspired separation of concerns:

- `app/` — pages and routes  
- `data/` — API communication services  
- `domain/` — models and validations  
- `presentation/` — shared components and providers  
- `infrastructure/` — infrastructure details (HTTP, cookies, etc.)

Styling with **Sass**, form validation with **Zod**, and remote data with **TanStack Query** and **Axios**.

---

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Sass, TanStack Query, Zod, Jest |
| Backend | Express, TypeScript, Prisma, SQLite, JWT, Swagger, Jest |
| Tooling | ESLint, Prettier, React Testing Library |

---

## Getting started

### Prerequisites

- Node.js 18+  
- npm or yarn  

### API

```bash
cd api
npm install
# set DATABASE_URL in .env (e.g. file:./dev.db)
npx prisma migrate deploy
npm run dev
```

The API runs in development with hot reload (`ts-node-dev`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the authentication screen.

### Tests

```bash
# frontend
cd frontend && npm test

# api
cd api && npm test
```

---

## API overview

| Resource | Responsibility |
| --- | --- |
| `/users` | Registration, authentication, and profile |
| `/patients` | Patient management |
| `/doctors` | Doctor management |
| `/specialties` | Specialty management |
| `/times` | Schedule availability |
| `/appointments` | Appointment booking and maintenance |

---

## Contributing

1. Create a branch from `main`  
2. Keep changes focused on a single responsibility  
3. Add tests when the flow warrants it  
4. Open a pull request describing the problem and the solution  

---

## License

Personal / educational project. Adjust the license as needed for this repository.
