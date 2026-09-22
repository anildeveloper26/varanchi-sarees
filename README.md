# Support Desk — ticket tracker

A small customer-support ticket app built as a take-home exercise. A support agent can create tickets (with customer name, order number and phone number), open a ticket to see its details, keep a running thread of notes on it, and mark it resolved.

Built with **React 19 + TypeScript + Vite**, `react-router-dom` for routing, and Vitest for tests. No backend — data lives in the browser's `localStorage`.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm test           # unit tests (Vitest)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint       # oxlint
```

Requires Node 20+.

## What it does

- **Create a ticket** — `/tickets/new`. Title, optional description, and the three identification fields: customer name, order number, phone number. Required fields are validated before saving.
- **List tickets** — `/`. Filter tabs for Open / Resolved / All with counts; the active filter is kept in the URL (`/?status=resolved`) so it survives refresh and can be linked. Open tickets sort first, newest first within each group. Each row links to the ticket.
- **Ticket detail** — `/tickets/:id`. Shows all fields, status badge, created/resolved timestamps, and the comment thread. Unknown ids show a "not found" page.
- **Comment thread** — add notes to a ticket; each note shows who wrote it and when. The author comes from the "Your name" box in the header (persisted, so you set it once). Posting is disabled until a name is set.
- **Resolve / reopen** — one button on the detail page. Resolved tickets get a `resolvedAt` timestamp and a green badge; reopening clears it.

Data and the agent name persist across refreshes via `localStorage` (`supportdesk.tickets`, `supportdesk.agentName`).

## Project structure

```
src/
  types.ts                 Ticket / Comment / filter types
  lib/
    tickets.ts             pure ticket logic (create, comment, resolve, reopen, filter) — no React
    tickets.test.ts        unit tests for the above
    storage.ts             guarded localStorage read/write
    format.ts              date formatting
    id.ts                  id generation
  store/
    context.ts             TicketsContext + value type
    TicketsProvider.tsx    holds state, persists it, exposes actions
    useTickets.ts          hook to read the context
  components/
    Layout.tsx             header (brand, nav, agent name) + <Outlet/>
    TicketList.tsx         list + filter tabs
    TicketForm.tsx         create form
    TicketDetail.tsx       single ticket view
    CommentThread.tsx      thread + add-note form
    StatusBadge.tsx
  App.tsx                  routes
  index.css                plain CSS, no UI library
```

## Decisions worth knowing

- **localStorage instead of a backend.** The brief said storage is our choice and no real database is needed. localStorage gives persistence across refreshes with zero setup for whoever runs it. Reads are wrapped in `try/catch` and fall back to an empty list if the stored value is missing or malformed.
- **Pure logic separated from React.** Everything that changes a ticket lives in `src/lib/tickets.ts` as immutable functions. The React provider is a thin wrapper. This is what the unit tests cover — the parts most likely to have bugs.
- **Agent name in the header, not auth.** The brief asks that each comment show *who* wrote it but says no login is needed. A persisted "Your name" field is the simplest honest answer.
- **Router with real URLs.** Ticket pages are deep-linkable and survive refresh. Small cost (one dependency) for a more realistic app shape.
- **No validation on phone format.** Formats vary by country; the field is required but not pattern-checked. Order number likewise is free text.
- **Colors and fonts** — deep green, cream, gold; Cormorant + DM Sans — chosen to feel like an internal tool for a premium retail brand. Design was not the focus.

## How I work: conventions used in this repo

- **Reusable components.** Anything rendered in more than one place is its own component — `StatusBadge` is shared by the list and the detail page, `Layout` owns the header once for every route, `CommentThread` is a self-contained unit that only needs a ticket id and its comments. New UI should be composed from these before adding new ones.
- **Stateless first, UI second.** Every rule about a ticket (create, comment, resolve, reopen, filter, sort) was written as a pure function in `src/lib/tickets.ts` and unit-tested *before* any component existed. Components are thin: they read from the store and call an action. If a component needs logic, it goes in `lib/` and gets a test, not in the JSX.
- **One source of truth.** Ticket state lives in `TicketsProvider` only. Components never touch `localStorage` directly; the provider persists through `lib/storage.ts`.

### Production rules

- `strict: true` in TypeScript. No `any`; `unknown` plus a check at boundaries (`JSON.parse`, URL params).
- State is never mutated. Every update returns a new object so React can detect the change.
- Anything that can throw at runtime (storage reads/writes, `JSON.parse`) is wrapped and has a safe fallback. The app must not white-screen on bad data.
- Invalid URLs are handled: unknown ticket id shows a not-found page, unknown filter falls back to the default, unknown route redirects home.
- `npm run build`, `npm run lint` and `npm test` must all pass before a commit. The build type-checks (`tsc -b`) — Vite alone does not.
- User-facing strings say what happened and what to do next (the validation banner names the missing fields; the disabled note button explains why).
- No secrets, no environment-specific values in the repo. Nothing here needs a `.env`.
- Small, focused commits with a message that says *why*, not just *what*.

## What I'd do with more time

- A small API (e.g. Express or a Vercel function) with a JSON/SQLite store so multiple agents share the same tickets.
- Edit and delete for comments; edit for ticket fields.
- Search by customer name / order number, and a priority field.
- Ticket assignment (who is handling it) and an activity log (created / resolved events in the thread).
- Component tests with Testing Library and a Playwright smoke test for the create → comment → resolve flow.
- Accessibility pass (focus management after navigation, live-region for the error message).

## How I used AI

I used Claude Code (Claude Opus) throughout. I gave it the brief, asked it to summarise the requirements, then had it draft a plan before writing any code. I made the design choices up front (localStorage, header name field for comment author, react-router, a few Vitest tests on the pure logic) and it implemented against that plan — scaffolding, types, the pure ticket functions and their tests, the context/provider, the components and the CSS. It also pointed a browser at the running app and walked through create → comment → resolve → filter → refresh → bad URL to verify everything worked.

Where I steered or corrected it: I asked it to plan before building instead of jumping straight into code; I asked it to pull the palette and fonts from the company's public website rather than inventing a theme; and after it split the context file to satisfy a lint warning I reviewed the resulting three files to make sure the split was actually clearer and not just quieter. One visual bug it introduced (required-field asterisks wrapping onto their own line) it caught itself in the browser check and fixed.
