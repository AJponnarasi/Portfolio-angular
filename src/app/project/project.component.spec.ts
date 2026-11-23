import { ComponentFixture, TestBed } from '@angular/core/testing';
import Splide from '@splidejs/splide';
import { yearsOfExperience } from '../shared/career';
import { ProjectComponent } from './project.component';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show factual stats, including the shared years of experience', () => {
    expect(component.stats[0]).toEqual({ number: `${yearsOfExperience()}+`, label: 'Years Experience' });
    expect(component.stats.map(s => s.label)).not.toContain('Frontend Focus');
  });

  it('should render the stats row', () => {
    const labels = Array.from(el.querySelectorAll('.stat-label')).map(s => s.textContent?.trim());
    expect(labels).toEqual(component.stats.map(s => s.label));
  });

  it('should render a card for every project with title, features and tech', () => {
    // Splide's loop mode adds clone slides, so look only at the originals
    const cards = el.querySelectorAll('.splide__slide:not(.splide__slide--clone) .project-card');
    expect(cards.length).toBe(component.projects.length);
    component.projects.forEach((p, i) => {
      expect(cards[i].querySelector('.card-title')?.textContent).toContain(p.title);
      expect(cards[i].querySelectorAll('.features li').length).toBe(p.features.length);
      expect(cards[i].querySelectorAll('.tech').length).toBe(p.technologies.length);
    });
  });

  it('should render a themed icon tile for every project', () => {
    const banners = el.querySelectorAll<HTMLElement>('.splide__slide:not(.splide__slide--clone) .banner');
    component.projects.forEach((p, i) => {
      const banner = banners[i];
      expect(banner.style.getPropertyValue('--from')).withContext(p.id).toBe(p.visual.from);
      expect(banner.style.getPropertyValue('--to')).withContext(p.id).toBe(p.visual.to);
      const iconClasses = p.visual.icon.split(' ');
      const tileIcon = banner.querySelector('.icon-tile i')!;
      iconClasses.forEach(c => expect(tileIcon.classList).withContext(p.id).toContain(c));
      expect(banner.querySelectorAll('.orbit i').length).toBe(2);
      expect(banner.querySelector('.banner-label')?.textContent?.trim()).toBe(p.visual.label);
    });
  });

  it('should use Font Awesome classes and hex colours for every visual', () => {
    for (const p of component.projects) {
      for (const icon of [p.visual.icon, ...p.visual.accents]) {
        expect(icon).withContext(p.id).toMatch(/^fa-solid fa-[a-z-]+$/);
      }
      expect(p.visual.from).withContext(p.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(p.visual.to).withContext(p.id).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('should hide decorative icons from screen readers', () => {
    expect(el.querySelector('.watermark')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.icon-stage')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have unique project ids', () => {
    const ids = component.projects.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should mount the carousel on its own element', () => {
    const root = el.querySelector('.splide')!;
    expect(component.carousel.nativeElement).toBe(root as HTMLElement);
    expect(root.classList).toContain('is-initialized');
  });

  it('should destroy the carousel on component destroy', () => {
    const splide = component['splide']!;
    expect(splide.state.is(Splide.STATES.DESTROYED)).toBeFalse();
    fixture.destroy();
    expect(splide.state.is(Splide.STATES.DESTROYED)).toBeTrue();
  });

  it('should track projects by id and stats by label', () => {
    expect(component.trackByProject(0, component.projects[0])).toBe(component.projects[0].id);
    expect(component.trackByStat(0, component.stats[0])).toBe(component.stats[0].label);
  });
});
