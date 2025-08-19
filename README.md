# <img src="./src/public/logo.png" width="40" /> TaskFlow

Modern task and events management powered by Next.js and Supabase.

---

## Quick Start

1. Prerequisites

- Node 18+ (or Bun 1.1+)
- Supabase project (for URL + anon key)

2. Environment
   Create a `.env` file at the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

3. Install & run

- With Bun:
  - `bun install`
  - `bun dev`
- With npm:
  - `npm install`
  - `npm run dev`

Build and run production:

- `bun run build` then `bun run start`
- or `npm run build` then `npm run start`

Lint:

- `bun run lint` or `npm run lint`

---

## Project Structure

- `src/app/`: Next.js App Router routes, layouts, and UI.
  - `src/app/(auth)`: Public auth pages (login, signup).
  - `src/app/app`: Authenticated app area.
    - `_components/`: App-specific UI/components.
    - `_store/`: Zustand stores.
  - `_components/UI`: Minimal internal UI kit (Button, Input, Card, Chip, Form, Avatar).
- `src/lib/`: Utilities and integrations (e.g., `supabase/*`, `cn.ts`). Use `@/…` imports.
- `src/public/` and `src/app/favicon.ico`: Static assets.
- Root config: `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `postcss.config.mjs`, `tsconfig.json`.

---

## Scripts

- `dev`: Start the dev server (Turbopack)
- `build`: Production build
- `start`: Start the built app
- `lint`: ESLint (Next core-web-vitals)

---

## Tech Stack

- Next.js (App Router), React, TypeScript (strict)
- Tailwind CSS with app-level tokens in `globals.css`
- Supabase (auth, database)
- Zustand for client state
- Framer Motion for micro-interactions

---

## Coding & Conventions

- Imports: `@/*` path alias for `src`.
- Formatting: Prettier (2-space, single quotes, width 100) + Tailwind class sorter.
- Linting: ESLint with `next/core-web-vitals` and TypeScript.
- Components: PascalCase in UI folders; utilities are camelCase.
- CSS: Global styles in `src/app/globals.css` with component-level Tailwind classes.

Internal UI kit lives in `src/app/_components/UI` and replaces external UI libraries to keep bundle size and styling consistent.

---

## Authentication

- Supabase Auth is used. Middleware guards the `/app` routes.
- Avoid mutating cookies outside the provided helpers.

---

## Configuration & Security

- Do not commit secrets. Keep `.env` local; rotate keys if exposed.
- `next.config.ts` includes image `remotePatterns` for Supabase Storage avatars. Update if your project/domain differs.

---

## Contributing

- Use Conventional Commits (e.g., `feat(app): …`, `refactor(sidebar): …`, `chore: …`).
- Open PRs with a clear summary, linked issues, and screenshots/GIFs for UI changes.
- Ensure `lint` passes and remove stray console logs.

---

## 🙏 Acknowledgements

Thanks to the teams behind Next.js, Supabase, Tailwind CSS, CodeX and the open-source community that makes modern web development so productive.
