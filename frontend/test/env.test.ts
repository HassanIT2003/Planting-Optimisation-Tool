import { describe, it, expect } from "vitest";

describe("Environment sanity", () => {
  it("import.meta.env exists", () => {
    expect(import.meta.env).toBeDefined();
  });

  it("MODE is defined", () => {
    expect(import.meta.env.MODE).toBeTruthy();
  });
});
