
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../calculator.html'), 'utf-8');

describe('Calculator Page (calculator.html)', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    vi.resetModules();
  });

  it('should have the correct title', () => {
    expect(document.title).toBe('Sapling Estimation');
  });

  it('should have a Farm ID input', () => {
    const input = document.getElementById('farmerId');
    expect(input).not.toBeNull();
    expect(input?.tagName).toBe('INPUT');
    expect(input?.getAttribute('type')).toBe('text');
  });

  it('should have a compute button', () => {
    const button = document.getElementById('computeBtn');
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('Compute Sapling Needs');
  });
});
