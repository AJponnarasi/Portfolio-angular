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

  it('should POST to the form service (also works without JavaScript)', () => {
    const form = el.querySelector('form')!;
    expect(form.getAttribute('action')).toMatch(/^https:\/\/submit-form\.com\//);
    expect(form.getAttribute('method')).toBe('post');
    expect(form.hasAttribute('target')).toBeFalse();
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

  describe('sending a message', () => {
    let fetchSpy: jasmine.Spy;
    const form = () => el.querySelector('form')!;
    const fill = (name = 'Test User', email = 'test.user@example.com', message = 'Hello there') => {
      el.querySelector<HTMLInputElement>('input[name="from_name"]')!.value = name;
      el.querySelector<HTMLInputElement>('input[name="user_email"]')!.value = email;
      el.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!.value = message;
    };
    const submit = async () => {
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const statusText = () => el.querySelector('.form-status')?.textContent?.trim() ?? '';

    beforeEach(() => {
      fetchSpy = spyOn(window, 'fetch').and.resolveTo(new Response('{}', { status: 200 }));
    });

    it('should POST the message as JSON and stay on the page', async () => {
      fill();
      const event = new Event('submit', { cancelable: true });
      form().dispatchEvent(event);
      await fixture.whenStable();

      expect(event.defaultPrevented).withContext('no navigation to the form service').toBeTrue();
      const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
      expect(url).toBe(component.endpoint);
      expect(init.method).toBe('POST');
      expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
      expect(JSON.parse(init.body as string)).toEqual({ name: 'Test User', email: 'test.user@example.com', message: 'Hello there' });
    });

    it('should show a success message and clear the form', async () => {
      fill();
      await submit();
      expect(component.status).toBe('sent');
      expect(statusText()).toContain('message has been sent');
      expect(el.querySelector<HTMLInputElement>('input[name="from_name"]')!.value).toBe('');
    });

    it('should show an email fallback when the service returns an error', async () => {
      fetchSpy.and.resolveTo(new Response('{}', { status: 500 }));
      fill('Asha', 'asha@example.com', 'Need a dashboard');
      await submit();
      expect(component.status).toBe('error');
      expect(statusText()).toContain("Couldn't send");
      const link = el.querySelector<HTMLAnchorElement>('.form-status a')!;
      expect(link.getAttribute('href')).toContain('mailto:ajpkponnarasi6@gmail.com');
      expect(decodeURIComponent(link.getAttribute('href')!)).toContain('Need a dashboard');
    });

    it('should show the fallback when the network is unreachable', async () => {
      fetchSpy.and.rejectWith(new TypeError('Failed to fetch'));
      fill();
      await submit();
      expect(component.status).toBe('error');
    });

    it('should not send an invalid form', async () => {
      fill('Test', 'not-an-email', 'Hi');
      await submit();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(component.status).toBe('idle');
    });

    it('should silently drop submissions that fill the spam trap', async () => {
      fill();
      el.querySelector<HTMLInputElement>('input[name="_honeypot"]')!.value = 'bot';
      await submit();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(component.status).toBe('sent');
    });

    it('should disable the button while sending and ignore double clicks', async () => {
      let resolve!: (r: Response) => void;
      fetchSpy.and.returnValue(new Promise<Response>(r => (resolve = r)));
      fill();
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      expect(component.status).toBe('sending');
      expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();

      form().dispatchEvent(new Event('submit', { cancelable: true }));
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      resolve(new Response('{}', { status: 200 }));
      await fixture.whenStable();
      expect(component.status).toBe('sent');
    });

    it('should hide the spam trap from people and screen readers', () => {
      const trap = el.querySelector<HTMLInputElement>('input[name="_honeypot"]')!;
      expect(trap.tabIndex).toBe(-1);
      expect(trap.getAttribute('aria-hidden')).toBe('true');
      expect(trap.getBoundingClientRect().right).toBeLessThan(0);
    });
  });
});
