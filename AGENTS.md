# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router routes, layouts, and UI. Auth lives in `src/app/(auth)`, the authenticated area in `src/app/app` (with `_components` and `_store`).
- `src/lib/`: Utilities and integrations (e.g., `supabase/*`, `cn.ts`). Import via `@/…` alias.
- `src/public/` and `src/app/favicon.ico`: Static assets.
- Root configs: `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `postcss.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands
- `bun dev` or `npm run dev`: Start the dev server (Turbopack).
- `bun run build` or `npm run build`: Production build.
- `bun run start` or `npm run start`: Start built app.
- `bun run lint` or `npm run lint`: ESLint checks (Next core-web-vitals rules).

Environment: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` before running. Example:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true`). Imports use `@/*` path alias.
- Formatting: Prettier (2‑space indent, single quotes, width 100) with Tailwind class sorter. Run `bunx prettier -w .` if needed.
- Linting: ESLint with `next/core-web-vitals` + TypeScript.
- Components: PascalCase files in UI folders (e.g., `Sidebar/DesktopLink.tsx`). Utilities: camelCase (e.g., `lib/hero.ts`). Zustand stores in `_store/`.
- CSS: Co-located in `src/app/globals.css` plus component-level classes (Tailwind).

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest/RTL for units and Playwright for E2E.
- Suggested layout: `src/__tests__/**/*.(test|spec).ts(x)`; name tests after the unit (e.g., `sidebar.store.test.ts`). Add a `test` script before introducing checks in CI.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits style is used (e.g., `feat(app): …`, `refactor(sidebar): …`, `chore: …`).
- PRs: Include a clear summary, linked issues (`Closes #123`), screenshots/GIFs for UI changes, and test/verification steps. Ensure `lint` passes and no stray console logs.

## Security & Configuration Tips
- Do not commit secrets. Keep `.env` local; rotate keys if exposed.
- Supabase auth runs via middleware; protect new `/app` routes accordingly and avoid mutating cookies outside provided helpers.
