import { products } from "../../../lib/catalog";

export function GET(): Response {
  return Response.json(products, { status: 200 });
}
