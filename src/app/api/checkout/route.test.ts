import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown): Request {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function expectBadRequest(body: unknown) {
  const response = await POST(request(body));
  expect(response.status).toBe(400);
  const data = (await response.json()) as { error?: unknown };
  expect(typeof data.error).toBe("string");
  expect((data.error as string).length).toBeGreaterThan(0);
}

describe("POST /api/checkout", () => {
  it("calculates a one-item total from the server catalog", async () => {
    const response = await POST(request({
      userId: "guest",
      items: [{ productId: "prod-001", quantity: 2, price: 0.01 }],
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ total: 25 });
  });

  it("supports multiple items", async () => {
    const response = await POST(request({
      userId: "guest",
      items: [
        { productId: "prod-001", quantity: 1 },
        { productId: "prod-003", quantity: 2 },
      ],
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ total: 58 });
  });

  it.each([
    ["non-object body", null],
    ["missing userId", { items: [{ productId: "prod-001", quantity: 1 }] }],
    ["empty userId", { userId: "", items: [{ productId: "prod-001", quantity: 1 }] }],
    ["missing items", { userId: "guest" }],
    ["empty items", { userId: "guest", items: [] }],
    ["unknown product", { userId: "guest", items: [{ productId: "nope", quantity: 1 }] }],
    ["missing quantity", { userId: "guest", items: [{ productId: "prod-001" }] }],
    ["zero quantity", { userId: "guest", items: [{ productId: "prod-001", quantity: 0 }] }],
    ["negative quantity", { userId: "guest", items: [{ productId: "prod-001", quantity: -1 }] }],
    ["fractional quantity", { userId: "guest", items: [{ productId: "prod-001", quantity: 1.5 }] }],
    ["string quantity", { userId: "guest", items: [{ productId: "prod-001", quantity: "1" }] }],
  ])("rejects %s", async (_label, body) => {
    await expectBadRequest(body);
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not-json",
    }));

    expect(response.status).toBe(400);
    const data = (await response.json()) as { error?: unknown };
    expect(typeof data.error).toBe("string");
  });
});
