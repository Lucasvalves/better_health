# Better Health

Clinic management and appointment scheduling on a single platform, with a conversational assistant that books and cancels appointments through the same API.

---

## About

Clinics often deal with scattered records, fragmented schedules, and manual booking. Better Health brings those operations together: registering users, patients, doctors, and specialties, defining each doctor's availability, and booking appointments in real calendar slots without conflicts.

The system is split into three services. The **API** owns the data, permissions, and scheduling rules. The **frontend** and the **assistant** are two clients of that API, so a booking made by either one goes through the same validation.

---

## Capabilities

| Area | What you can do |
| --- | --- |
| **Access** | Create an account, sign in, and edit your profile and avatar |
| **Registration** | Manage patients, doctors (CRM and specialty), and specialties (with appointment duration) |
| **Availability** | Define the weekdays and time ranges each doctor works |
| **Appointments** | See available days, book, search by patient, reschedule, and cancel |
| **Assistant** | Book or cancel an appointment from a free-text request |

Typical workflow:

1. Register a user and sign in
2. Register specialties and doctors
3. Set each doctor's availability
4. Register patients
5. Book, reschedule, or cancel appointments, from the web app or through the assistant

---

## Architecture

```
better_health/
├── api/          # REST API
├── frontend/     # Web app
└── assistant/    # Conversational agent
```

```
Browser ──► frontend :3000 ──► api :3333 ──► SQLite
                                  ▲
Client ───► assistant :3001 ──────┘
                 │
                 └──► OpenRouter (language model)
```

| Service | Role | Stack | Port | Docs |
| --- | --- | --- | --- | --- |
| `api` | Source of truth for data, authentication, and scheduling rules | Express, Prisma, SQLite | 3333 | [api/README.md](api/README.md) |
| `frontend` | Web interface for clinic staff | Next.js, React | 3000 | [frontend/README.md](frontend/README.md) |
| `assistant` | Natural-language scheduling and cancellation | Fastify, LangGraph | 3001 | [assistant/README.md](assistant/README.md) |

### Shared principles

- **The API is the single source of truth.** Appointment constraints, authorization, and persistence live there. The frontend and the assistant never reimplement them.
- **One authentication mechanism.** Users sign in through the API and receive a JWT. The frontend stores it, and the assistant receives it on each request and forwards it to the API.
- **Each service is independent.** Services communicate only over HTTP, run on their own, and are configured through their own environment files.

---

## Getting started

Prerequisites:

- Node.js 18+ for `api` and `frontend`
- Node.js 24.10+ for `assistant`
- npm

Configure and start the services in this order. Each service README lists its environment variables and commands.

1. [`api`](api/README.md#getting-started) — the other two depend on it
2. [`frontend`](frontend/README.md#getting-started) — open [http://localhost:3000](http://localhost:3000)
3. [`assistant`](assistant/README.md#getting-started) — optional, needs an OpenRouter key

Interactive API docs are available at [http://localhost:3333/v1/docs](http://localhost:3333/v1/docs) once the API is running.

---

## Contributing

1. Create a branch from `main`
2. Keep changes focused on a single responsibility
3. Add tests when the flow warrants it, especially for appointment conflicts, authorization, and date handling
4. Use commit messages in the form `type: short description` (`feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`)
5. Open a pull request describing the problem and the solution

Service-specific conventions are in each service README.

---

## License

Personal / educational project. Adjust the license as needed for this repository.
