# Repository Guidelines

## Project Structure & Module Organization

- `src/app/`: Next.js App Router routes, layouts, and UI. Auth in `src/app/(auth)`; authenticated area in `src/app/app` (with `_components` and `_store`).
- `src/lib/`: Utilities and integrations (e.g., `supabase/*`, `cn.ts`). Import via `@/…` (example: `import { cn } from '@/lib/cn'`).
- `src/public/` and `src/app/favicon.ico`: Static assets.
- Root configs: `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `postcss.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands

- `bun dev` / `npm run dev`: Start the dev server (Turbopack).
- `bun run build` / `npm run build`: Create a production build.
- `bun run start` / `npm run start`: Serve the built app.
- `bun run lint` / `npm run lint`: Run ESLint (Next core-web-vitals rules).
- Environment: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` before running:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```

## Coding Style & Naming Conventions

- Language: TypeScript (`strict: true`). Use `@/*` path alias for imports.
- Formatting: Prettier (2-space indent, single quotes, width 100) with Tailwind class sorter. Format with `bunx prettier -w .`.
- Linting: ESLint with `next/core-web-vitals` and TypeScript rules.
- Naming: Components PascalCase (e.g., `Sidebar/DesktopLink.tsx`); utilities camelCase (e.g., `lib/hero.ts`); Zustand stores in `_store/`.
- CSS: Tailwind classes; global styles in `src/app/globals.css`.

## Testing Guidelines

- Frameworks: none configured yet. Prefer Vitest + React Testing Library for units and Playwright for E2E.
- Layout: `src/__tests__/**/*.(test|spec).ts(x)`; name tests after the unit (e.g., `sidebar.store.test.ts`).
- Scripts: add a `test` script before CI checks. Keep tests fast and deterministic.

## Commit & Pull Request Guidelines

- Commits: use Conventional Commits (e.g., `feat(app): add task list`, `chore: update deps`).
- PRs: include a clear summary, linked issues (`Closes #123`), screenshots/GIFs for UI changes, and test/verification steps. Ensure `lint` passes and no stray `console` logs.

## Security & Configuration Tips

- Do not commit secrets. Keep `.env` local; rotate keys if exposed.
- Supabase auth runs via middleware—protect new `/app` routes accordingly and avoid mutating cookies outside provided helpers.
