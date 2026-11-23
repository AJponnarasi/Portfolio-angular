import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
const META_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#0b1626' };

/**
 * Light/dark theme.
 * - Starts from the visitor's saved choice, else their system setting.
 * - The inline script in index.html applies it before first paint (no flash); this
 *   service reads that value and keeps it in sync.
 * - Follows system changes until the visitor picks a theme themselves.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();

  constructor() {
    if (!this.isBrowser) return;
    const current = this.doc.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' || current === 'light' ? current : this.systemTheme(), false);

    // Follow the OS setting until the visitor makes an explicit choice
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', e => {
      if (!this.storedTheme()) this.apply(e.matches ? 'dark' : 'light', true);
    });
  }

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable (private mode): the choice lasts for this visit only */
    }
    this.apply(theme, true);
  }

  private apply(theme: Theme, animate: boolean): void {
    this._theme.set(theme);
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    if (animate) {
      root.classList.add('theme-transition');
      setTimeout(() => root.classList.remove('theme-transition'), 400);
    }
    root.setAttribute('data-theme', theme);
    this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  }

  private storedTheme(): Theme | null {
    try {
      const t = localStorage.getItem(THEME_STORAGE_KEY);
      return t === 'dark' || t === 'light' ? t : null;
    } catch {
      return null;
    }
  }

  private systemTheme(): Theme {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
