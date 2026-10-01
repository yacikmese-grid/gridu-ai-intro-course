import { describe, expect, it } from "vitest";
import { calculateDiscount } from "./pricing";

describe("calculateDiscount", () => {
  it("returns zero for the baseline placeholder", () => {
    expect(calculateDiscount(100)).toBe(0);
  });
});
