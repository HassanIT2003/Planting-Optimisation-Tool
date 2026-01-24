import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(
  path.resolve(__dirname, "../recommendations.html"),
  "utf-8"
);

describe("Recommendations Page (recommendations.html)", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    vi.resetModules();
  });

  it("should have the correct title", () => {
    expect(document.title).toBe(
      "Agroforestry Recommendations | Planting Optimisation Tool"
    );
  });

  it("should have a navigation bar", () => {
    const nav = document.querySelector("nav.nav");
    expect(nav).not.toBeNull();
  });

  it("should have inputs for farm data", () => {
    expect(document.getElementById("latitude")).not.toBeNull();
    expect(document.getElementById("longitude")).not.toBeNull();
    expect(document.getElementById("ph")).not.toBeNull();
    expect(document.getElementById("soilTexture")).not.toBeNull();
    expect(document.getElementById("rainfall")).not.toBeNull();
    expect(document.getElementById("temperature")).not.toBeNull();
    expect(document.getElementById("elevation")).not.toBeNull();
    expect(document.getElementById("area")).not.toBeNull();
    expect(document.getElementById("slope")).not.toBeNull();
  });

  it("should have a generate recommendations button", () => {
    // Select the submit button inside the form
    const button = document.querySelector('button[type="submit"]');
    expect(button).not.toBeNull();
    expect(button?.textContent?.trim()).toBe("Generate Recommendations");
  });

  it("should have a hidden results section initially", () => {
    const results = document.getElementById("resultsSection");
    expect(results).not.toBeNull();
    expect(results?.hidden).toBe(true);
  });
});
