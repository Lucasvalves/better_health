# Assistant

Conversational agent that books and cancels Better Health appointments from free-text requests. It does not touch the database: every action goes through the [API](../api/README.md) using the caller's token. See the [root README](../README.md) for how it fits into the system.

**Stack:** Node.js 24.10+, Fastify, LangGraph, LangChain, OpenRouter, Zod, Node test runner.

---

## Getting started

Copy `.env.example` to `.env`:

| Variable | Purpose |
| --- | --- |
| `OPENROUTER_API_KEY` | OpenRouter key used for the language model |
| `BETTER_HEALTH_API_URL` | API base URL (defaults to `http://localhost:3333`) |
| `BETTER_HEALTH_DEV_TOKEN` | Optional fallback JWT for local use and LangGraph Studio. Never commit a real token |
| `LANGSMITH_API_KEY`, `LANGCHAIN_TRACING_V2`, `LANGCHAIN_PROJECT` | Optional LangSmith tracing |
| `PORT` | HTTP port (defaults to `3001`) |

```bash
npm install
npm run dev
```

The API must be running. Get a token from `POST /users/auth` on the API, then:

```bash
curl -X POST http://localhost:3001/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Agendar consulta com o Dr. Silva amanhã às 10h para Maria, CPF 12345678900","token":"<jwt>"}'
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Server with watch mode and inspector |
| `npm start` | Server |
| `npm run test:unit` | Unit tests |
| `npm run test:e2e` | Route tests (load `.env`) |
| `npm test` | All tests (load `.env`) |
| `npm run langgraph:serve` | LangGraph Studio for the `medical_appointments` graph |

---

## How it works

### Endpoint

`POST /chat`

| Field | Rule |
| --- | --- |
| `question` | string, at least 10 characters |
| `token` | string, Better Health JWT |

The response includes `intent`, `actionSuccess`, `actionError`, `error`, the extracted `doctorName`, `datetime`, `patientName`, `appointmentData`, and the conversation `messages`; the last message is the reply. A body that fails validation (missing `token`, short `question`) returns `400`. A rejected token returns `401`. Other failures return `500` with a generic message.

### Graph

Defined in `src/graph/graph.ts`:

```
START → identifyIntent ─┬─ schedule ─► message → END
                        ├─ cancel   ─► message → END
                        └─ unknown or error ─► message → END
```

| Node | Responsibility |
| --- | --- |
| `identifyIntent` | Loads the clinic's doctors from the API, then asks the model for a structured result: intent (`schedule`, `cancel`, `unknown`) and the appointment fields |
| `schedule` | Checks the required fields (doctor, datetime, patient name or CPF) and creates the appointment |
| `cancel` | Cancels by appointment id, or by doctor, datetime, and patient |
| `message` | Writes the reply from the outcome. Falls back to a fixed message if the reply is empty or contains an id |

The graph state (`GraphState`) is declared in the same file. Nodes return partial state updates.

### Boundaries

- **Model output is untrusted.** Intent data is parsed against a Zod schema, and each node validates the fields it needs before calling the API.
- **Scheduling rules stay in the API.** The assistant resolves the patient and specialty, then sends the booking request. Conflicts, availability, and permissions are decided by the API and reported back in the reply.
- **The token is per request.** `src/graph/factory.ts` builds a graph for each call with the token from `/chat`, falling back to `BETTER_HEALTH_DEV_TOKEN` only when none is given.

### Structure

```
src/
├── index.ts            # Starts the server
├── server.ts           # Fastify app and /chat route
├── config.ts           # Environment and model settings
├── graph/
│   ├── graph.ts        # State and graph definition
│   ├── factory.ts      # Builds the graph for a token
│   └── nodes/          # One file per node
├── prompts/v1/         # System and user prompts with Zod output schemas
└── services/
    ├── openRouterService.ts      # Model client with structured output
    ├── betterHealthApiClient.ts  # HTTP client for the API
    └── appointmentService.ts     # Booking and cancellation logic on top of the client
tests/
├── units/              # Unit tests with fake dependencies
└── e2es/               # Route tests that inject a fake graph
langgraph.json          # Graph entry for LangGraph Studio
```

### Extending

To support a new action, add a node in `src/graph/nodes/`, extend the `intent` enum in `graph.ts` and `prompts/v1/identifyIntent.ts`, wire the node and its edge in `buildAppointmentGraph`, and add a scenario to `prompts/v1/messageGenerator.ts`. Calls to new API endpoints go through `betterHealthApiClient.ts`.

The model list and temperature are in `src/config.ts`.

---

## Tests

```bash
npm run test:unit
```

Unit tests cover the scheduler node, the message generator node, the API client, and the appointment service. The e2e test calls `POST /chat` with an injected graph. Neither needs the network or a model key.

`npm test` and `npm run test:e2e` load `.env` through `--env-file`, so create that file first. `npm run test:unit` does not.
