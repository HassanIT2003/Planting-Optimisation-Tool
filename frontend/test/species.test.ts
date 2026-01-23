
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../species.html'), 'utf-8');

describe('Species Page (species.html)', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    vi.resetModules();
  });

  it('should have the correct title', () => {
    expect(document.title).toBe('Species | Planting Optimisation Tool');
  });

  it('should have a search input', () => {
    const input = document.getElementById('insightsSearch');
    expect(input).not.toBeNull();
    expect(input?.getAttribute('type')).toBe('search');
  });

  it('should have a search button', () => {
    const button = document.getElementById('insightsSearchBtn');
    expect(button).not.toBeNull();
  });

  it('should have a grid for articles', () => {
    const grid = document.getElementById('insightsArticles');
    expect(grid).not.toBeNull();
  });

  it('should have a hidden empty message initially', () => {
    const emptyMsg = document.getElementById('insightsEmpty');
    expect(emptyMsg).not.toBeNull();
    expect(emptyMsg?.hidden).toBe(true);
  });
});
