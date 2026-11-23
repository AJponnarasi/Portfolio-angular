import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFakeResume } from '../shared/resume.testing';
import { yearsOfExperience } from '../shared/career';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: HTMLElement;

  let resumeFake: ReturnType<typeof provideFakeResume>;

  beforeEach(async () => {
    resumeFake = provideFakeResume(false);
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [resumeFake.provider]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the name and role as the page h1', () => {
    const h1 = el.querySelector('h1');
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(h1?.textContent).toContain('Ponnarasi');
    expect(h1?.textContent).toContain('Front End');
    expect(h1?.textContent).toContain('Developer');
    expect(el.querySelector('.greeting')?.textContent).toContain('Ponnarasi');
  });

  it('should use the shared years-of-experience figure', () => {
    expect(component.yearsOfExperience).toBe(yearsOfExperience());
    expect(component.yearsOfExperience).toBeGreaterThanOrEqual(6);
  });

  it('should show the experience stat in the template', () => {
    const stats = Array.from(el.querySelectorAll('.stat-card .stat-value')).map(h => h.textContent?.trim());
    expect(stats).toEqual([`${component.yearsOfExperience}+`, '10+']);
  });

  it('should link the CTAs to the contact and projects sections', () => {
    const ctas = Array.from(el.querySelectorAll<HTMLAnchorElement>('a.btn')).map(a => a.getAttribute('href'));
    expect(ctas).toEqual(['#contact', '#projects']);
  });

  it('should show the optimized portrait with responsive sources', () => {
    const img = el.querySelector<HTMLImageElement>('.portrait-img')!;
    expect(img.getAttribute('src')).toContain('profile/portrait-cutout-800.webp');
    expect(img.getAttribute('srcset')).toContain('portrait-cutout-480.webp 480w');
    expect(img.getAttribute('alt')).toBe('Portrait of Ponnarasi');
    expect(img.getAttribute('width')).toBe('800');
    expect(img.getAttribute('height')).toBe('1000');
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });

  it('should render above-the-fold content without scroll animations', () => {
    expect(el.querySelector('.hero-copy')?.hasAttribute('data-aos')).toBeFalse();
    expect(el.querySelector('.portrait')?.hasAttribute('data-aos')).toBeFalse();
  });

  it('should hide the decorative vertical name from screen readers', () => {
    const panel = el.querySelector('.name-style')!.parentElement!;
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  describe('resume download', () => {
    it('should hide the download link while the resume is unavailable', () => {
      resumeFake.setAvailable(false);
      fixture.detectChanges();
      expect(el.querySelector('a.resume-cta')).toBeNull();
    });

    it('should show a download link to the PDF once it is available', () => {
      resumeFake.setAvailable(true);
      fixture.detectChanges();
      const link = el.querySelector<HTMLAnchorElement>('a.resume-cta');
      expect(link).not.toBeNull();
      expect(link!.getAttribute('href')).toBe('Ponnarasi_resume.pdf');
      expect(link!.getAttribute('download')).toBe('Ponnarasi-Front-End-Developer-Resume.pdf');
    });
  });
});
