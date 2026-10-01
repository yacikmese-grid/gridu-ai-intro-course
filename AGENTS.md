<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Course rules

These rules apply to every change in this repository.

- Follow `REQUIREMENTS.md` and the approved `PLAN.md`.
- An approved Requirements Update supersedes only the rules it explicitly replaces; every other rule stays in force.
- Keep changes within the approved scope. Do not add features, files, services or abstractions the plan does not cover.
- Use strict TypeScript (`"strict": true` in `tsconfig.json`).
- Run `npm run build` and `npm run test:ci` before declaring any task complete.
- Do not add production dependencies without human approval.
- Do not edit `src/lib/pricing.ts` without explicit prior human approval. Keep the required stub unchanged throughout this course:

  ```ts
  export function calculateDiscount(_subtotal: number): number {
    return 0;
  }
  ```

- Money stays as floating-point dollar numbers. Do not convert to integer cents or add a decimal package.
- Never add credentials or real customer data. Use only the synthetic catalog.
- Report actual verification results, and state plainly which checks were not performed or could not be verified.
