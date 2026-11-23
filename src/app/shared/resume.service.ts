import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Single source of truth for the downloadable resume.
 *
 * Drop the PDF at `public/Ponnarasi_resume.pdf`; it is served from the site root.
 * Download buttons stay hidden until the file is confirmed to exist, so the live
 * site never shows a broken link.
 */
@Injectable({ providedIn: 'root' })
export class ResumeService {
  /** Public URL of the resume, relative to the site root. */
  readonly url = 'Ponnarasi_resume.pdf';
  /** File name the visitor's browser saves it as. */
  readonly fileName = 'Ponnarasi-Front-End-Developer-Resume.pdf';

  private readonly _available = signal(false);
  /** True once the PDF has been confirmed to exist. */
  readonly available = this._available.asReadonly();

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      void this.check();
    }
  }

  /** Confirms the file is really a PDF (not an SPA fallback page) and updates `available`. */
  async check(): Promise<boolean> {
    try {
      const res = await fetch(this.url, { method: 'HEAD', cache: 'no-cache' });
      const isPdf = res.ok && (res.headers.get('content-type') ?? '').includes('application/pdf');
      this._available.set(isPdf);
    } catch {
      this._available.set(false);
    }
    return this._available();
  }
}
