import { describe, it, expect } from "vitest";
import { parseNumber } from "../src/utils/parseNumber";

describe("parseNumber()", () => {
  it("parses valid numbers", () => {
    expect(parseNumber("10")).toBe(10);
    expect(parseNumber("3.5")).toBe(3.5);
  });

  it("returns 0 for invalid input", () => {
    expect(parseNumber("abc")).toBe(0);
    expect(parseNumber("")).toBe(0);
  });

  it("handles negative numbers", () => {
    expect(parseNumber("-5")).toBe(-5);
  });
});
