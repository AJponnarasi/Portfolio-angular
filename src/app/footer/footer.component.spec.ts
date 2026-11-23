import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the current year in the copyright', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
    expect(el.querySelector('.copy')?.textContent).toContain(String(component.currentYear));
  });

  it('should render an accessible link per social profile', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('a.social'));
    expect(links.length).toBe(component.SOCIAL_MEDIA.length);
    links.forEach((a, i) => {
      expect(a.getAttribute('href')).toBe(component.SOCIAL_MEDIA[i].url);
      expect(a.getAttribute('aria-label')).toBe(component.SOCIAL_MEDIA[i].name);
    });
  });

  it('should open external profiles safely in a new tab', () => {
    el.querySelectorAll<HTMLAnchorElement>('a.social').forEach(a => {
      expect(a.target).toBe('_blank');
      expect(a.rel).toContain('noopener');
    });
  });

  it('should use mailto for the email link', () => {
    const mail = component.SOCIAL_MEDIA.find(s => s.name === 'Email');
    expect(mail?.url).toMatch(/^mailto:/);
  });

  it('should list only professional profiles', () => {
    const urls = component.SOCIAL_MEDIA.map(s => s.url).join(' ');
    expect(urls).not.toContain('facebook.com');
    expect(urls).not.toContain('instagram.com');
    expect(urls).toContain('linkedin.com');
  });

  it('should have a back-to-top link', () => {
    expect(el.querySelector('a.to-top')?.getAttribute('href')).toBe('#home');
  });
});
