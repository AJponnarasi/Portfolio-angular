import { TestBed } from '@angular/core/testing';
import { ResumeService } from './resume.service';

describe('ResumeService', () => {
  let fetchSpy: jasmine.Spy;

  const respond = (status: number, contentType: string) =>
    Promise.resolve(new Response(null, { status, headers: { 'content-type': contentType } }));

  beforeEach(() => {
    // Default: file missing. Individual tests override before calling check().
    fetchSpy = spyOn(window, 'fetch').and.callFake(() => respond(404, 'text/html'));
    TestBed.configureTestingModule({});
  });

  it('should point at the PDF in the site root with a friendly download name', () => {
    const service = TestBed.inject(ResumeService);
    expect(service.url).toBe('Ponnarasi_resume.pdf');
    expect(service.fileName).toMatch(/\.pdf$/);
  });

  it('should check the file with a HEAD request on creation', () => {
    TestBed.inject(ResumeService);
    expect(fetchSpy).toHaveBeenCalledWith('Ponnarasi_resume.pdf', jasmine.objectContaining({ method: 'HEAD' }));
  });

  it('should be available when the server returns a PDF', async () => {
    fetchSpy.and.callFake(() => respond(200, 'application/pdf'));
    const service = TestBed.inject(ResumeService);
    expect(await service.check()).toBeTrue();
    expect(service.available()).toBeTrue();
  });

  it('should be unavailable when the file is missing', async () => {
    const service = TestBed.inject(ResumeService);
    expect(await service.check()).toBeFalse();
    expect(service.available()).toBeFalse();
  });

  it('should be unavailable when the server falls back to an HTML page', async () => {
    fetchSpy.and.callFake(() => respond(200, 'text/html; charset=utf-8'));
    const service = TestBed.inject(ResumeService);
    expect(await service.check()).toBeFalse();
  });

  it('should be unavailable when the request fails', async () => {
    fetchSpy.and.callFake(() => Promise.reject(new TypeError('offline')));
    const service = TestBed.inject(ResumeService);
    expect(await service.check()).toBeFalse();
  });
});
