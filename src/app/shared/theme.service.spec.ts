import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = document.documentElement;
  let savedAttr: string | null;
  let savedStorage: string | null;

  beforeEach(() => {
    savedAttr = root.getAttribute('data-theme');
    savedStorage = localStorage.getItem(THEME_STORAGE_KEY);
    localStorage.removeItem(THEME_STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    savedAttr === null ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', savedAttr);
    savedStorage === null ? localStorage.removeItem(THEME_STORAGE_KEY) : localStorage.setItem(THEME_STORAGE_KEY, savedStorage);
  });

  it('should adopt the theme already applied by the pre-paint script', () => {
    root.setAttribute('data-theme', 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('should fall back to the system preference when nothing is applied', () => {
    root.removeAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe(prefersDark ? 'dark' : 'light');
    expect(root.getAttribute('data-theme')).toBe(service.theme());
  });

  it('should toggle between light and dark and update <html>', () => {
    root.setAttribute('data-theme', 'light');
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(root.getAttribute('data-theme')).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(root.getAttribute('data-theme')).toBe('light');
  });

  it('should remember the visitor’s choice', () => {
    root.setAttribute('data-theme', 'light');
    TestBed.inject(ThemeService).set('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('should update the browser theme-color meta tag', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#ffffff';
    document.head.appendChild(meta);
    try {
      root.setAttribute('data-theme', 'light');
      TestBed.inject(ThemeService).set('dark');
      expect(meta.content).toBe('#0b1626');
    } finally {
      meta.remove();
    }
  });

  it('should still switch when storage is unavailable', () => {
    root.setAttribute('data-theme', 'light');
    spyOn(Storage.prototype, 'setItem').and.throwError('blocked');
    const service = TestBed.inject(ThemeService);
    expect(() => service.set('dark')).not.toThrow();
    expect(root.getAttribute('data-theme')).toBe('dark');
  });
});
