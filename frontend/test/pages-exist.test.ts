import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("HTML pages exist", () => {
  const pages = [
    "index.html",
    "calculator.html",
    "recommendations.html",
    "insights.html",
  ];

  pages.forEach(page => {
    it(`${page} exists`, () => {
      const filePath = path.resolve(__dirname, `../${page}`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
