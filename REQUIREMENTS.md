# Project Requirements

## Stack
- Next.js with App Router.
- Strict TypeScript.
- A src directory.
- npm, with package-lock.json.
- Scripts named exactly dev, build, and test:ci.
- The project must run with npm install followed by npm run dev.
- Keep the implementation small.

## Baseline scope
- A home page with a heading and link to /checkout.
- A checkout page at src/app/checkout/page.tsx.
- GET /api/products at src/app/api/products/route.ts.
- POST /api/checkout at src/app/api/checkout/route.ts.
- src/lib/pricing.ts.
- README.md explaining setup and the request lifecycle.
- One placeholder unit test connected to test:ci.
- No authentication, database, persistent data file, Docker, or external service.
- No real payments, shipping, taxes, refunds, or inventory management.
- Only synthetic training data. Never add credentials or customer data.

## Design
- Use one global CSS file or inline styles.
- No Tailwind, component library, or CSS-in-JS package.
- Use a system font, one accent color, rounded buttons or cards,
  a centered max-width container, and consistent spacing.

## Product catalog
GET /api/products returns HTTP 200 with exactly this array:

```json
[
  {"id":"prod-001","name":"Enamel Mug","price":12.5},
  {"id":"prod-002","name":"Canvas Tote","price":18.0},
  {"id":"prod-003","name":"Wool Beanie","price":22.75}
]
```

Keep these products on the server. Their IDs, names, and prices remain
unchanged throughout the project.

## Checkout request

```json
{
  "userId": "guest",
  "items": [
    {"productId": "prod-001", "quantity": 1}
  ]
}
```

## Validation
- userId must be a non-empty string.
- items must be a non-empty array.
- Each productId must identify a catalog product.
- Each quantity must be a positive integer.
- Reject zero, negative, fractional, missing, or nonnumeric quantities.
- Reject malformed JSON and invalid request shapes.
- Invalid requests return HTTP 400 with:

```json
{"error":"A human-readable message"}
```

## Calculation
- Use server catalog prices, never client-sent prices.
- Ignore extra client fields rather than using them in calculations.
- subtotal = sum of catalog price multiplied by quantity.
- discount = calculateDiscount(subtotal).
- total = subtotal minus discount.
- Represent money as floating-point dollars throughout this exercise.
- Do not change to integer cents or introduce a decimal package.
- Baseline success returns HTTP 200 with {"total": number}.
- Baseline checkout does not save an order.

## Protected pricing file
src/lib/pricing.ts must contain exactly:

```ts
export function calculateDiscount(_subtotal: number): number {
  return 0;
}
```

Creating this exact stub is permitted after approval of the baseline plan.
Any later edit requires explicit human approval before the edit.
No task requires real discount logic. Keep this stub unchanged.

## UI
- Use "guest" as the fixed userId.
- A simple product selector and quantity field are sufficient.
- The API must support multiple items even if the UI submits one item.
- Show pending, success, and error states.

## Required verification
- npm install.
- npm run build.
- npm run test:ci, which must exit without watch mode.
- Browser checks for home and checkout.
- Live HTTP checks for products and checkout.
- Review the actual changes against the approved scope.

## Course process
- Obtain my approval of the plan before implementation.
- Later requirements replace earlier rules only through an approved update.
- Course documents and evaluation configuration do not expand app scope.
- Complete the model-effort exercise before adding persistence.
