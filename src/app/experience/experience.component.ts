import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Experience {
  company_name: string;
  image: string;
  role: string;
  time_period: string;
  /** "Mon YYYY", e.g. "Feb 2025" */
  start_date: string;
  /** "Mon YYYY" or "Present" */
  end_date: string;
  work_type: string;
  location: string;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Parses "Mon YYYY" (or "Present") into a Date at the first of that month. */
export function parseMonthYear(value: string, now: Date = new Date()): Date {
  if (value.trim().toLowerCase() === 'present') {
    return new Date(now.getFullYear(), now.getMonth());
  }
  const [monthStr = '', yearStr = ''] = value.trim().split(/\s+/);
  const month = MONTHS.indexOf(monthStr.slice(0, 3).toLowerCase());
  const year = parseInt(yearStr, 10);
  if (month < 0 || Number.isNaN(year)) {
    throw new Error(`Invalid date "${value}", expected "Mon YYYY" or "Present"`);
  }
  return new Date(year, month);
}

/** Human-readable duration between two "Mon YYYY" values, e.g. "1 yr 9 mos". */
export function calculateDuration(start: string, end: string, now: Date = new Date()): string {
  const startDate = parseMonthYear(start, now);
  const endDate = parseMonthYear(end, now);

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (totalMonths <= 0) return '< 1 mo';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearPart = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const monthPart = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
  return [yearPart, monthPart].filter(Boolean).join(' ');
}

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  readonly EXPERIENCE_LIST: (Experience & { duration: string })[] = ([
    {
      company_name: 'WaveMaker Inc.',
      image: 'assets/images/wavemaker_logo.jpg',
      role: 'Senior Development Engineer',
      time_period: 'Feb 2025 - Present',
      start_date: 'Feb 2025',
      end_date: 'Present',
      work_type: 'Full-time',
      location: 'Hyderabad, Telangana, India'
    },
    {
      company_name: 'TechConative',
      image: 'assets/images/techconative_logo.jpg',
      role: 'Software Engineer',
      time_period: 'Jul 2023 - Feb 2025',
      start_date: 'Jul 2023',
      end_date: 'Feb 2025',
      work_type: 'Full-time',
      location: 'Hyderabad, Telangana, India'
    },
    {
      company_name: 'Boodskap',
      image: 'assets/images/boodskap_logo.jpg',
      role: 'Software Engineer',
      time_period: 'Sep 2019 - Jun 2023',
      start_date: 'Sep 2019',
      end_date: 'Jun 2023',
      work_type: 'Full-time',
      location: 'Hyderabad, Telangana, India'
    }
  ] as Experience[]).map(e => ({ ...e, duration: calculateDuration(e.start_date, e.end_date) }));
}
