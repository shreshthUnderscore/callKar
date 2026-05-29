# Agent Instructions

## Package manager

- Use Bun for installs and scripts: `bun install` and `bun run <script>`.
- If you need Turbo, prefer `bun run <script>` at the root or `bun exec turbo <task>`.

## Repo map

- apps/backend: NestJS API server.
- apps/frontend: React + Vite SPA.
- packages/ui: shared React components.
- packages/eslint-config, packages/typescript-config: shared configs.

## Common commands (root)

- `bun run dev` (turbo dev)
- `bun run build`
- `bun run lint`
- `bun run check-types`
- `bun run format`

## Tests

- Backend: run from apps/backend: `bun run test`, `bun run test:e2e`, `bun run test:cov`.
- Frontend: no test script defined yet.

## Git guidance

- Do not create commits or amend history unless explicitly asked.
- If dependencies change, include the Bun lockfile in the same commit.

## Reference docs

- Root overview: ./README.md
- Backend specifics: ./apps/backend/README.md
- Frontend specifics: ./apps/frontend/README.md
- Shared UI package: ./packages/ui
