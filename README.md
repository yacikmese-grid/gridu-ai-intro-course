# Checkout Training Application

A deliberately small Next.js App Router exercise using synthetic product data. It has no authentication, database, persistent order storage, external service, or real payment behavior.

## Setup and run

```bash
npm install
npm run dev
```

Open the local Next.js URL, then visit `/` or `/checkout`.

Verification commands:

```bash
npm run build
npm run test:ci
```

`test:ci` uses `vitest run`, so it exits instead of entering watch mode.

## API contracts

### `GET /api/products`

Returns HTTP 200 with exactly:

```json
[
  {"id":"prod-001","name":"Enamel Mug","price":12.5},
  {"id":"prod-002","name":"Canvas Tote","price":18.0},
  {"id":"prod-003","name":"Wool Beanie","price":22.75}
]
```

### `POST /api/checkout`

Example request:

```json
{
  "userId": "guest",
  "items": [
    {"productId": "prod-001", "quantity": 1}
  ]
}
```

`userId` must be a non-empty string. `items` must be a non-empty array. Every `productId` must match the server catalog and every `quantity` must be a positive integer. Malformed JSON, invalid shapes, unknown products, and invalid quantities return HTTP 400:

```json
{"error":"A human-readable message"}
```

A valid checkout can contain multiple items. The server ignores extra client fields for calculation, looks up each price from the server catalog, computes the subtotal, calls `calculateDiscount(subtotal)`, and returns HTTP 200:

```json
{"total":12.5}
```

## Browser-to-server request lifecycle

1. The browser renders the home page and links to `/checkout`.
2. The checkout page fetches `GET /api/products` and fills its single product selector.
3. The user chooses one product and quantity. The UI always sends `userId: "guest"`.
4. While `POST /api/checkout` is pending, the form is disabled to prevent duplicate submission and a pending message is shown.
5. The checkout route parses and validates the request at runtime, not just through TypeScript types.
6. The route finds each product in the shared server-side catalog and uses those catalog prices rather than any client-supplied price.
7. The route computes `subtotal`, calls `calculateDiscount(subtotal)`, computes `total = subtotal - discount`, and returns JSON.
8. The UI displays either the successful total or a human-readable error.

## Money simplification

This training exercise intentionally represents money as JavaScript floating-point dollar numbers. It does not convert values to integer cents and does not use a decimal arithmetic package.

## Persistence

Checkout is currently stateless. A successful request returns a calculated total only; it does not create or save an order, and there is no database or persistent data file.
