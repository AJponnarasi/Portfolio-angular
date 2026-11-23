import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFakeResume } from '../shared/resume.testing';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let el: HTMLElement;

  let resumeFake: ReturnType<typeof provideFakeResume>;

  beforeEach(async () => {
    resumeFake = provideFakeResume(false);
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [resumeFake.provider]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading without the old typo', () => {
    expect(el.textContent).toContain('Contact Me');
    expect(el.textContent).not.toContain('Contect');
  });

  it('should post the form to the form service in a new tab', () => {
    const form = el.querySelector('form')!;
    expect(form.getAttribute('action')).toMatch(/^https:\/\/submit-form\.com\//);
    expect(form.getAttribute('target')).toBe('_blank');
  });

  it('should require name, email and message', () => {
    const name = el.querySelector<HTMLInputElement>('input[name="from_name"]')!;
    const email = el.querySelector<HTMLInputElement>('input[name="user_email"]')!;
    const message = el.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!;
    expect(name.required).toBeTrue();
    expect(email.required).toBeTrue();
    expect(email.type).toBe('email');
    expect(message.required).toBeTrue();
  });

  it('should be invalid when empty and valid when filled correctly', () => {
    const form = el.querySelector('form')!;
    expect(form.checkValidity()).toBeFalse();

    el.querySelector<HTMLInputElement>('input[name="from_name"]')!.value = 'Test User';
    el.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!.value = 'Hello';
    const email = el.querySelector<HTMLInputElement>('input[name="user_email"]')!;

    email.value = 'not-an-email';
    expect(form.checkValidity()).withContext('bad email').toBeFalse();

    email.value = 'test.user@example.com';
    expect(form.checkValidity()).withContext('good email').toBeTrue();
  });

  it('should link email and phone with mailto/tel', () => {
    const hrefs = Array.from(el.querySelectorAll<HTMLAnchorElement>('a.info-card')).map(a => a.getAttribute('href'));
    expect(hrefs.some(h => h?.startsWith('mailto:'))).toBeTrue();
    expect(hrefs.some(h => h?.startsWith('tel:+91'))).toBeTrue();
  });

  describe('resume download', () => {
    it('should hide the download link while the resume is unavailable', () => {
      resumeFake.setAvailable(false);
      fixture.detectChanges();
      expect(el.querySelector('a.resume-card')).toBeNull();
    });

    it('should show a download link to the PDF once it is available', () => {
      resumeFake.setAvailable(true);
      fixture.detectChanges();
      const link = el.querySelector<HTMLAnchorElement>('a.resume-card');
      expect(link).not.toBeNull();
      expect(link!.getAttribute('href')).toBe('Ponnarasi_resume.pdf');
      expect(link!.getAttribute('download')).toBe('Ponnarasi-Front-End-Developer-Resume.pdf');
    });
  });
});
