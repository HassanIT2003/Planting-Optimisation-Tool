import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Static assets", () => {
  it("main style.css exists", () => {
    const cssPath = path.resolve(__dirname, "../src/style.css");
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it("home.css exists", () => {
    const cssPath = path.resolve(__dirname, "../src/home.css");
    expect(fs.existsSync(cssPath)).toBe(true);
  });
});
