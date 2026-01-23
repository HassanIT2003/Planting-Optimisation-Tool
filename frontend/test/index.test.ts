
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

describe('Home Page (index.html)', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    vi.resetModules();
  });

  it('should have the correct title', () => {
    expect(document.title).toBe('Home | Planting Optimisation Tool');
  });

  it('should have a navigation bar with links', () => {
    const nav = document.querySelector('nav.nav');
    expect(nav).not.toBeNull();
    const links = nav?.querySelectorAll('a');
    expect(links?.length).toBe(5);
    expect(links?.[0].textContent).toContain('Home');
    expect(links?.[1].textContent).toContain('Environmental Profile');
    expect(links?.[2].textContent).toContain('Sapling Estimation');
    expect(links?.[3].textContent).toContain('Agroforestry Recommendation');
    expect(links?.[4].textContent).toContain('Species');
  });

  it('should have a hero section with a video', () => {
    const hero = document.querySelector('.heroSection');
    expect(hero).not.toBeNull();
    const video = hero?.querySelector('video');
    expect(video).not.toBeNull();
  });

  it('should have a "Generate" button in the hero section', () => {
    const cta = document.querySelector('.heroCTA');
    const button = cta?.querySelector('.exploreButton');
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe('Generate');
  });

  it('should have a footer', () => {
    const footer = document.querySelector('footer.site-footer');
    expect(footer).not.toBeNull();
  });
});
