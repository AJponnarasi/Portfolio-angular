import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceComponent, calculateDuration, parseMonthYear } from './experience.component';

describe('parseMonthYear', () => {
  it('should parse "Mon YYYY" to the first of that month', () => {
    const d = parseMonthYear('Feb 2025');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(1);
  });

  it('should accept full month names and any case', () => {
    expect(parseMonthYear('september 2019').getMonth()).toBe(8);
  });

  it('should resolve "Present" to the given current month', () => {
    const d = parseMonthYear('Present', new Date(2026, 10, 23));
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(10);
  });

  it('should throw on malformed input', () => {
    expect(() => parseMonthYear('2025')).toThrowError(/Invalid date/);
    expect(() => parseMonthYear('Foo 2025')).toThrowError(/Invalid date/);
  });
});

describe('calculateDuration', () => {
  const now = new Date(2026, 10, 23); // 23 Nov 2026

  it('should format years and months', () => {
    expect(calculateDuration('Jul 2023', 'Feb 2025', now)).toBe('1 yr 7 mos');
    expect(calculateDuration('Sep 2019', 'Jun 2023', now)).toBe('3 yrs 9 mos');
  });

  it('should handle "Present"', () => {
    expect(calculateDuration('Feb 2025', 'Present', now)).toBe('1 yr 9 mos');
  });

  it('should use singular units and omit zero parts', () => {
    expect(calculateDuration('Jan 2020', 'Jan 2021', now)).toBe('1 yr');
    expect(calculateDuration('Jan 2020', 'Feb 2020', now)).toBe('1 mo');
    expect(calculateDuration('Jan 2020', 'Jan 2022', now)).toBe('2 yrs');
  });

  it('should handle month wrap-around across years', () => {
    expect(calculateDuration('Nov 2020', 'Feb 2021', now)).toBe('3 mos');
  });

  it('should show "< 1 mo" for same-month or reversed ranges', () => {
    expect(calculateDuration('Mar 2024', 'Mar 2024', now)).toBe('< 1 mo');
    expect(calculateDuration('Mar 2024', 'Jan 2024', now)).toBe('< 1 mo');
  });
});

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a timeline item per role, newest first', () => {
    const roles = Array.from(el.querySelectorAll('.timeline-item .card-title')).map(h => h.textContent?.trim());
    expect(roles.length).toBe(component.EXPERIENCE_LIST.length);
    expect(el.querySelector('.timeline-item .company')?.textContent).toContain('WaveMaker');
  });

  it('should mark only the first role as current', () => {
    const items = el.querySelectorAll('.timeline-item');
    expect(items[0].querySelector('.current-chip')).not.toBeNull();
    expect(items[0].querySelector('.dot.current')).not.toBeNull();
    expect(el.querySelectorAll('.current-chip').length).toBe(1);
  });

  it('should precompute and display each duration', () => {
    const shown = Array.from(el.querySelectorAll('.duration')).map(d => d.textContent?.trim());
    expect(shown).toEqual(component.EXPERIENCE_LIST.map(e => e.duration));
    expect(component.EXPERIENCE_LIST[1].duration).toBe('1 yr 7 mos');
  });

  it('should have parseable dates for every entry', () => {
    for (const e of component.EXPERIENCE_LIST) {
      expect(() => parseMonthYear(e.start_date)).withContext(e.company_name).not.toThrow();
      expect(() => parseMonthYear(e.end_date)).withContext(e.company_name).not.toThrow();
    }
  });
});
