import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../shared/resume.service';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly resume = inject(ResumeService);

  /** Formspark (submit-form.com) endpoint. Accepts JSON POSTs and form POSTs. */
  readonly endpoint = 'https://submit-form.com/vtcoKsHLNuIfSsHeThxtd';
  readonly email = 'ajpkponnarasi6@gmail.com';

  status: ContactStatus = 'idle';
  /** Pre-filled email used as a fallback when sending fails. */
  mailtoFallback = `mailto:${this.email}`;

  async onSubmit(event: Event, form: HTMLFormElement): Promise<void> {
    // Send in the background and stay on the page instead of navigating to the form service
    event.preventDefault();
    if (this.status === 'sending') return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '').trim();

    // Bots fill the hidden honeypot field; pretend success and drop it
    if (value('_honeypot')) {
      this.status = 'sent';
      form.reset();
      return;
    }

    const payload = { name: value('from_name'), email: value('user_email'), message: value('message') };
    this.mailtoFallback =
      `mailto:${this.email}?subject=${encodeURIComponent('Portfolio enquiry from ' + payload.name)}` +
      `&body=${encodeURIComponent(payload.message)}`;

    this.status = 'sending';
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.status = 'sent';
      form.reset();
    } catch {
      this.status = 'error';
    }
  }
}
