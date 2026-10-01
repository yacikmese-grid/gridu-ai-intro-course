import { products } from "../../../lib/catalog";
import { calculateDiscount } from "../../../lib/pricing";

function error(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return error("Request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return error("Request body must be a JSON object.");
  }

  const record = body as Record<string, unknown>;
  const { userId, items } = record;

  if (typeof userId !== "string" || userId.trim().length === 0) {
    return error("userId must be a non-empty string.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    return error("items must be a non-empty array.");
  }

  let subtotal = 0;

  for (const item of items) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return error("Each item must be an object.");
    }

    const itemRecord = item as Record<string, unknown>;
    const { productId, quantity } = itemRecord;

    if (typeof productId !== "string") {
      return error("Each item must include a valid productId.");
    }

    const product = products.find((candidate) => candidate.id === productId);
    if (!product) {
      return error(`Unknown productId: ${productId}`);
    }

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return error("Each quantity must be a positive integer.");
    }

    subtotal += product.price * quantity;
  }

  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;

  return Response.json({ total }, { status: 200 });
}
