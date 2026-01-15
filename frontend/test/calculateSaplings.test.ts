import { describe, it, expect } from "vitest";
import * as saplingModule from "../src/sapling-calculator";

describe("sapling-calculator module", () => {
  it("loads the sapling calculator module without errors", () => {
    expect(saplingModule).toBeDefined();
  });

  it("exports at least one value", () => {
    expect(Object.keys(saplingModule).length).toBeGreaterThan(0);
  });
});
