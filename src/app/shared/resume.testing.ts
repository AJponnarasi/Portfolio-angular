import { Provider, signal } from '@angular/core';
import { ResumeService } from './resume.service';

/** Test double for ResumeService with a controllable `available` flag. */
export function provideFakeResume(available: boolean): { provider: Provider; setAvailable: (v: boolean) => void } {
  const flag = signal(available);
  const fake: Partial<ResumeService> = {
    url: 'Ponnarasi_resume.pdf',
    fileName: 'Ponnarasi-Front-End-Developer-Resume.pdf',
    available: flag.asReadonly(),
    check: async () => flag()
  };
  return { provider: { provide: ResumeService, useValue: fake }, setAvailable: v => flag.set(v) };
}
