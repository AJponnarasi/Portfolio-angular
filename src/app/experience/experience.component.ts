import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  EXPERIENCE_LIST :any = [{
    company_name : 'WaveMaker Inc.',
    image : 'assets/images/wavemaker_logo.jpg',
    role : 'Senior Development Engineer',
    time_period : 'Feb 2025 - Present',
    start_date: 'Feb 2025',
    end_date : 'Present',
    work_type: 'Full-time',
    location: 'Hyderabad, Telangana, India'
  },{
    company_name : 'TechConative',
    image : 'assets/images/techconative_logo.jpg',
    role : 'Software Engineer',
    start_date: 'Jul 2023',
    end_date : 'Feb 2025',
    time_period : 'Jul 2023 - Feb 2025',
    work_type: 'Full-time',
    location: 'Hyderabad, Telangana, India'
  },{
    company_name : 'Boodskap',
    image : 'assets/images/boodskap_logo.jpg',
    role : 'Software Engineer',
    time_period : 'Sep 2019 - Jun 2023',
    start_date: 'Sep 2019',
    end_date : 'Jun 2023',
    work_type: 'Full-time',
    location: 'Hyderabad, Telangana, India',
  }]
  ngAfterViewInit() {
    AOS.refresh();
  }

  calculateDuration(start: string, end: string): string {
    const currentDate = new Date();
  
    const parseDate = (str: string): Date => {
      if (str.toLowerCase() === 'present') return currentDate;
      const [monthStr, yearStr] = str.split(' ');
      const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth(); // Month is 0-indexed
      const year = parseInt(yearStr, 10);
      return new Date(year, month);
    };
  
    const startDate = parseDate(start);
    const endDate = parseDate(end);
  
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
  
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    const yearPart = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthPart = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
  
    return [yearPart, monthPart].filter(Boolean).join(' ');
  }
  
}
