# Approved Baseline Implementation Plan

Status: **Approved for baseline implementation planning only.**

This plan records the user-approved baseline scope from `REQUIREMENTS.md`. Application implementation has not started. The approval permits the **initial creation** of the exact protected pricing stub shown below when implementation begins. Any later modification to `src/lib/pricing.ts` requires new explicit human approval.

## Approved dependency versions

Production dependencies only:

```json
{
  "next": "16.3.7",
  "react": "19.3.0",
  "react-dom": "19.3.0"
}
```

Development dependencies only:

```json
{
  "@types/node": "22.20.4",
  "@types/react": "19.3.0",
  "@types/react-dom": "19.3.0",
  "typescript": "5.9.3",
  "vitest": "4.1.11"
}
```

Installed toolchain observed during planning:

- Node.js: `v22.16.0`
- npm: `10.9.2`

No other packages are approved unless a later requirement makes one necessary and the addition is explicitly explained and approved.

## Exact npm scripts

`package.json` must define these script names and commands exactly:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test:ci": "vitest run"
  }
}
```

`test:ci` must exit without watch mode.

## Exact baseline file list

The implementation is limited to the following files, preserving any pre-existing files unless an approved baseline file must be created or updated to satisfy the requirements:

1. `package.json`
   - Declares the approved dependencies and exact scripts.

2. `package-lock.json`
   - Generated and maintained by npm to lock the approved dependency graph.

3. `tsconfig.json`
   - Configures strict TypeScript for the Next.js App Router project and the `src` directory.

4. `next-env.d.ts`
   - Provides the standard Next.js TypeScript environment declarations.

5. `README.md`
   - Documents setup, commands, scope limits, and the request lifecycle.

6. `src/app/layout.tsx`
   - Root App Router layout.
   - Imports the single global stylesheet.
   - May define minimal metadata.

7. `src/app/globals.css`
   - The only CSS file.
   - Uses a system font, one accent color, rounded buttons/cards, a centered max-width container, and consistent spacing.
   - No Tailwind, CSS-in-JS, or component-library styling.

8. `src/app/page.tsx`
   - Home page with a heading and a link to `/checkout`.

9. `src/app/checkout/page.tsx`
   - Small client-side checkout UI.
   - Fetches products from `/api/products`.
   - Uses fixed `userId: "guest"`.
   - Contains one product selector, one quantity input, and one submit button.
   - Shows pending, success, and error states.
   - May submit one item even though the API supports multiple items.

10. `src/app/api/products/route.ts`
    - Implements `GET /api/products`.
    - Reads the shared server-side catalog.
    - Returns HTTP 200 with the catalog exactly as required.

11. `src/app/api/checkout/route.ts`
    - Implements `POST /api/checkout`.
    - Keeps JSON parsing, request-shape validation, item validation, server-price lookup, subtotal calculation, discount calculation, and total calculation in this route.
    - Returns HTTP 400 with `{ "error": "A human-readable message" }` for malformed or invalid requests.
    - Returns HTTP 200 with `{ "total": number }` on success.
    - Does not persist an order.

12. `src/lib/catalog.ts`
    - The one shared server-side product catalog module.
    - Contains exactly these products and unchanged IDs, names, and prices:

```json
[
  {"id":"prod-001","name":"Enamel Mug","price":12.5},
  {"id":"prod-002","name":"Canvas Tote","price":18.0},
  {"id":"prod-003","name":"Wool Beanie","price":22.75}
]
```

13. `src/lib/pricing.ts`
    - Protected pricing file.
    - Initial creation is approved only if it contains exactly:

```ts
export function calculateDiscount(_subtotal: number): number {
  return 0;
}
```

    - **No later modification is approved by this plan.** Any later edit requires explicit human approval first.

14. `src/lib/pricing.test.ts`
    - One placeholder Vitest unit test connected to `test:ci`.
    - Verifies the approved pricing stub returns `0` for a representative subtotal.

No additional architecture, abstraction layers, persistence files, services, repositories, schemas, UI component libraries, or helper packages are planned.

## Request lifecycle

### Home page

1. Browser requests `/`.
2. Next.js App Router renders `src/app/page.tsx`.
3. The page displays a heading and a link to `/checkout`.

### Product loading

1. Browser opens `/checkout`.
2. `src/app/checkout/page.tsx` requests `GET /api/products`.
3. `src/app/api/products/route.ts` reads the shared server-side catalog from `src/lib/catalog.ts`.
4. The API returns HTTP 200 with exactly:

```json
[
  {"id":"prod-001","name":"Enamel Mug","price":12.5},
  {"id":"prod-002","name":"Canvas Tote","price":18.0},
  {"id":"prod-003","name":"Wool Beanie","price":22.75}
]
```

5. The checkout UI populates its single product selector from that response.

### Checkout submission

The UI submits a request of this form, using fixed `userId: "guest"`:

```json
{
  "userId": "guest",
  "items": [
    {"productId": "prod-001", "quantity": 1}
  ]
}
```

The checkout route then:

1. Parses JSON and catches malformed JSON.
2. Requires a valid top-level request object.
3. Requires `userId` to be a non-empty string.
4. Requires `items` to be a non-empty array.
5. Requires every item to be an object with a known catalog `productId`.
6. Requires every `quantity` to be a numeric positive integer.
7. Rejects zero, negative, fractional, missing, or nonnumeric quantities.
8. Ignores unrelated extra client fields rather than using them in calculations.
9. Looks up all prices from the server-side catalog; client-supplied prices are never authoritative.
10. Computes `subtotal = sum(catalog price * quantity)`.
11. Computes `discount = calculateDiscount(subtotal)`.
12. Computes `total = subtotal - discount`.
13. Uses floating-point dollar numbers throughout; no cents conversion or decimal package.
14. Returns HTTP 200 with `{"total": number}` on success.
15. Returns HTTP 400 with `{"error":"A human-readable message"}` for invalid input.
16. Saves nothing and creates no persistent order.

The route supports multiple items even though the baseline UI submits only one item.

## Automated checks

After implementation, run in this order:

```text
npm install
npm run build
npm run test:ci
```

Acceptance criteria:

- `npm install` succeeds and produces/updates `package-lock.json` using the approved package set.
- `npm run build` succeeds.
- `npm run test:ci` succeeds, exits, and does not enter watch mode.
- The placeholder unit test passes against the unchanged pricing stub.

## Manual browser checks

Verify locally in the running application:

1. `/` renders successfully.
2. Home page shows a heading.
3. Home page has a working link to `/checkout`.
4. `/checkout` renders successfully.
5. Checkout loads exactly the three catalog products.
6. The UI contains one product selector, one quantity input, and one submit button.
7. A checkout submission shows a pending state while awaiting the response.
8. A successful checkout shows the returned total.
9. An API or validation failure shows an error state.
10. Styling uses the single global stylesheet with the required simple visual design.

## Live HTTP acceptance checks

### Products endpoint

- `GET /api/products` returns HTTP 200.
- Response is exactly:

```json
[
  {"id":"prod-001","name":"Enamel Mug","price":12.5},
  {"id":"prod-002","name":"Canvas Tote","price":18.0},
  {"id":"prod-003","name":"Wool Beanie","price":22.75}
]
```

### Checkout success cases

- One valid item returns HTTP 200 with the correct `total`.
- Multiple valid items are accepted and summed correctly.
- Server catalog prices are used even if the client includes an extra fake price field.
- Extra client fields do not affect calculations.

### Checkout failure cases

Each invalid request below must return HTTP 400 with a JSON object shaped as `{"error":"A human-readable message"}`:

- Malformed JSON.
- Invalid top-level request shape.
- Missing `userId`.
- Empty-string `userId`.
- Missing `items`.
- Non-array `items`.
- Empty `items` array.
- Unknown `productId`.
- Missing quantity.
- Quantity `0`.
- Negative quantity.
- Fractional quantity.
- String/nonnumeric quantity.

## Scope acceptance checks

Review the actual changes against this approved plan and verify:

- Next.js uses the App Router.
- TypeScript is strict.
- Application code lives under `src`.
- npm and `package-lock.json` are used.
- Only the three approved production dependencies are present.
- Development dependencies are limited to TypeScript, the required type definitions, and Vitest as approved above.
- No Tailwind, component library, CSS-in-JS package, schema-validation package, decimal package, or unnecessary package is added.
- There is only one global CSS file.
- There is one shared server-side catalog module.
- Checkout validation and total calculation remain in the checkout route.
- The UI remains limited to one selector, one quantity input, and one submit button plus status/output text.
- No authentication is added.
- No database is added.
- No persistent data file is added.
- No Docker configuration is added.
- No external service is connected.
- No real payment, shipping, taxes, refunds, or inventory behavior is added.
- No credentials or customer data are added.
- Only synthetic training data is used.
- No order is persisted.
- Money remains floating-point dollars.
- `src/lib/pricing.ts` exactly matches the approved stub at initial creation and is not subsequently modified without explicit approval.
- No unrelated files or features are introduced.

## Requirement-to-implementation mapping

| Requirement | Approved implementation or verification |
|---|---|
| Next.js with App Router | `src/app/layout.tsx`, `src/app/page.tsx`, route files under `src/app/api` |
| Strict TypeScript | `tsconfig.json` with strict mode |
| `src` directory | All application/library code under `src/` |
| npm and `package-lock.json` | `package.json`, `npm install`, generated lockfile |
| Scripts exactly `dev`, `build`, `test:ci` | `next dev`, `next build`, `vitest run` |
| Runs with `npm install` then `npm run dev` | Manual verification after implementation |
| Small implementation | Exact file list above; no extra architecture |
| Home heading and `/checkout` link | `src/app/page.tsx` |
| Checkout exact path | `src/app/checkout/page.tsx` |
| Products endpoint exact path | `src/app/api/products/route.ts` |
| Checkout endpoint exact path | `src/app/api/checkout/route.ts` |
| Pricing exact path | `src/lib/pricing.ts` |
| README setup and lifecycle | `README.md` |
| Placeholder unit test | `src/lib/pricing.test.ts` with `vitest run` |
| No auth/database/persistent file/Docker/external service | No such files/dependencies; scope review |
| No payments/shipping/taxes/refunds/inventory | Not implemented; scope review |
| Synthetic training data only | Fixed server catalog |
| No credentials/customer data | Scope review |
| One global CSS file | `src/app/globals.css` |
| No Tailwind/component library/CSS-in-JS | Dependency/file review |
| System font/accent/rounded/container/spacing | `src/app/globals.css`; browser review |
| Exact three-product catalog | `src/lib/catalog.ts`; exact HTTP response check |
| Catalog remains server-side | Server modules own catalog; UI fetches API |
| IDs/names/prices unchanged | Literal catalog plus exact endpoint check |
| Fixed UI userId `guest` | `src/app/checkout/page.tsx` |
| UI one selector/quantity/button | `src/app/checkout/page.tsx` |
| API supports multiple items | Checkout route validates/iterates all items |
| Non-empty `userId` | Checkout-route validation |
| Non-empty `items` | Checkout-route validation |
| Known product IDs | Checkout-route catalog lookup |
| Positive integer quantities | Checkout-route runtime validation |
| Reject malformed JSON/shapes | Checkout-route parse/error handling |
| Invalid response shape | HTTP 400 + `{error: string}` |
| Server catalog prices | Checkout-route lookup only |
| Ignore extra fields | Validation/calculation uses only required values |
| Subtotal calculation | Checkout route |
| Discount calculation | `calculateDiscount(subtotal)` |
| Total calculation | `subtotal - discount` in checkout route |
| Floating-point dollars | Plain JavaScript numbers |
| HTTP 200 `{total: number}` | Checkout success response |
| No order saving | No persistence code |
| Exact pricing stub | Initial creation only, text shown above |
| Pricing changes need later approval | Explicit protection recorded in this plan |
| Pending/success/error UI | Checkout component state |
| Required install/build/test verification | Commands and acceptance checks above |
| Browser checks | Manual browser checklist above |
| Live HTTP checks | HTTP matrix above |
| Review actual changes against scope | Final diff/Git-status review |
| Approval before implementation | This plan records approval; implementation has not started |
| Later requirements need approved update | Any scope change requires explicit approval |
| Course/evaluation docs do not expand scope | No implementation derived from them |
| Model-effort exercise before persistence | No persistence planned or approved |

## Assumptions and limitations

- At planning time, the intended Git worktree and repository-specific instruction files were not exposed in the execution environment. Before implementation begins, repository root, repository instructions, and Git status must be inspected again without initializing a nested repository.
- Existing files must be preserved. If an approved path already exists, its contents must be inspected before deciding whether it needs a minimal approved update rather than replacement.
- The product catalog is shared only on the server; the browser learns products through `GET /api/products`.
- The baseline UI submits one item; multiple-item support is an API capability only.
- There is no persistence in this plan.
- This approval does not authorize deployment, pushing, merging, external-service connections, or scope expansion.
