import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/products", () => {
  it("returns exactly the three catalog products", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      { id: "prod-001", name: "Enamel Mug", price: 12.5 },
      { id: "prod-002", name: "Canvas Tote", price: 18.0 },
      { id: "prod-003", name: "Wool Beanie", price: 22.75 },
    ]);
  });
});
