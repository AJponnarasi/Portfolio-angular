import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFakeResume } from './shared/resume.testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let el: HTMLElement;

  let resumeFake: ReturnType<typeof provideFakeResume>;

  beforeEach(async () => {
    resumeFake = provideFakeResume(false);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [resumeFake.provider],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Global styles set `scroll-behavior: smooth`; tests need the scroll to happen immediately
  const scrollTo = (top: number) => window.scrollTo({ top, behavior: 'instant' });

  afterEach(() => scrollTo(0));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render every page section with a matching id', () => {
    const ids = Array.from(el.querySelectorAll('main > section')).map(s => s.id);
    expect(ids).toEqual(['home', 'skills', 'services', 'experience', 'projects', 'contact']);
  });

  it('should use one h1 and an h2 heading in every content section', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    for (const id of ['skills', 'services', 'experience', 'projects', 'contact']) {
      expect(el.querySelector(`#${id} h2`)).withContext(id).not.toBeNull();
    }
    expect(el.querySelectorAll('h4, h5, h6').length).toBe(0);
  });

  it('should have a nav item pointing at each section', () => {
    const sectionIds = Array.from(el.querySelectorAll('main > section')).map(s => s.id);
    expect(app.NAV_ITEMS.map(i => i.id)).toEqual(sectionIds);
  });

  it('should render desktop nav links with correct hrefs', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.desktop-nav a'));
    expect(links.length).toBe(app.NAV_ITEMS.length);
    expect(links.map(a => a.getAttribute('href'))).toEqual(app.NAV_ITEMS.map(i => '#' + i.id));
  });

  it('should mark the active section link', () => {
    app.activeSection = 'skills';
    fixture.detectChanges();
    const active = el.querySelector('.desktop-nav a.active');
    expect(active?.textContent?.trim()).toBe('Skills');
  });

  it('should switch theme from the header toggle and label it accordingly', () => {
    const root = document.documentElement;
    const before = root.getAttribute('data-theme');
    const stored = localStorage.getItem('theme');
    try {
      const btn = el.querySelector<HTMLButtonElement>('.theme-toggle')!;
      const start = app.theme.theme();
      btn.click();
      fixture.detectChanges();
      const next = start === 'dark' ? 'light' : 'dark';
      expect(app.theme.theme()).toBe(next);
      expect(root.getAttribute('data-theme')).toBe(next);
      expect(btn.getAttribute('aria-label')).toBe(next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      expect(btn.querySelector('i')!.classList).toContain(next === 'dark' ? 'fa-sun' : 'fa-moon');
    } finally {
      before === null ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', before);
      stored === null ? localStorage.removeItem('theme') : localStorage.setItem('theme', stored);
    }
  });

  it('should toggle the mobile menu', () => {
    const toggle = el.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const mobileNav = el.querySelector('.mobile-nav')!;
    expect(mobileNav.classList).not.toContain('open');

    toggle.click();
    fixture.detectChanges();
    expect(app.isMenuVisible).toBeTrue();
    expect(mobileNav.classList).toContain('open');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();
    expect(app.isMenuVisible).toBeFalse();
  });

  it('should close the mobile menu when a mobile link is clicked', () => {
    app.isMenuVisible = true;
    fixture.detectChanges();
    el.querySelector<HTMLAnchorElement>('.mobile-nav a')!.click();
    expect(app.isMenuVisible).toBeFalse();
  });

  it('should set scrolled state and progress on scroll', () => {
    app.onScroll();
    expect(app.isScrolled).toBeFalse();
    expect(app.scrollProgress).toBeGreaterThanOrEqual(0);

    scrollTo(200);
    app.onScroll();
    expect(app.isScrolled).toBeTrue();
    expect(app.scrollProgress).toBeGreaterThan(0);
    expect(app.scrollProgress).toBeLessThanOrEqual(100);
  });

  it('should update the active section as the page scrolls', () => {
    const contact = el.querySelector<HTMLElement>('#contact')!;
    scrollTo(contact.offsetTop);
    app.onScroll();
    expect(app.activeSection).toBe('contact');

    scrollTo(0);
    app.onScroll();
    expect(app.activeSection).toBe('home');
  });

  describe('resume download', () => {
    it('should hide the download link while the resume is unavailable', () => {
      resumeFake.setAvailable(false);
      fixture.detectChanges();
      expect(el.querySelector('.header-actions a[download]')).toBeNull();
    });

    it('should show a download link to the PDF once it is available', () => {
      resumeFake.setAvailable(true);
      fixture.detectChanges();
      const link = el.querySelector<HTMLAnchorElement>('.header-actions a[download]');
      expect(link).not.toBeNull();
      expect(link!.getAttribute('href')).toBe('Ponnarasi_resume.pdf');
      expect(link!.getAttribute('download')).toBe('Ponnarasi-Front-End-Developer-Resume.pdf');
    });

    it('should also offer the resume in the mobile menu', () => {
      resumeFake.setAvailable(true);
      fixture.detectChanges();
      const link = el.querySelector<HTMLAnchorElement>('.mobile-nav a.resume-link');
      expect(link?.getAttribute('aria-label')).toBe('Download resume');
      expect(link?.hasAttribute('download')).toBeTrue();
    });
  });
});
