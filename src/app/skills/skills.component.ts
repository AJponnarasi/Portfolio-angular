import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

export interface Skill {
  id: string;
  title: string;
  desc: string;
  description: string;
  icon: string;
  colorClass: string;
  keySkills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  expanded?: boolean;
}


@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  isModalOpen = false;
  selectedSkill: Skill | null = null;
  SKILLS_LIST: Skill[] = [
    {
      id: 'angular',
      title: 'Angular',
      desc: 'Frontend framework',
      description: 'Component-based architecture and enterprise applications',
      icon: 'assets/images/angular.png',
      colorClass: 'angular',
      keySkills: [
        'Component architecture and lifecycle',
        'Services, dependency injection, and RxJS',
        'Angular CLI and project structure',
        'Routing and navigation guards',
        'Form handling (reactive & template-driven)'
      ],
      experienceLevel: 'advanced',
      expanded: false
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      desc: 'Typed JavaScript',
      description: 'Type-safe JavaScript with enhanced developer experience',
      icon: 'assets/images/typescript.png',
      colorClass: 'typescript',
      keySkills: [
        'Type annotations and interfaces',
        'Generics and advanced type features',
        'Module systems and namespaces',
        'Decorators and metadata',
        'Integration with modern frameworks'
      ],
      experienceLevel: 'advanced',
      expanded: false
    },
    {
      id: 'jest',
      title: 'Jest',
      desc: 'JavaScript Testing Framework',
      description: 'Delightful unit testing framework for JavaScript and TypeScript projects',
      icon: 'assets/images/jest.png',
      colorClass: 'jest',
      keySkills: [
        'Writing unit and integration tests',
        'Mocking functions and modules',
        'Snapshot testing',
        'Code coverage reporting',
        'Test-driven development (TDD) practices'
      ],
      experienceLevel: 'intermediate',
      expanded: false
    },
    {
      id: 'html5',
      title: 'HTML5',
      desc: 'Markup language for web',
      description: 'Semantic markup, accessibility, and modern web standards',
      icon: 'assets/images/html5.png',
      colorClass: 'html5',
      keySkills: [
        'Semantic HTML5 elements and structure',
        'Form validation and input types',
        'Canvas and SVG integration',
        'Web accessibility (WCAG guidelines)',
        'SEO optimization techniques'
      ],
      experienceLevel: 'advanced',
      expanded: false
    },
    {
      id: 'css3',
      title: 'CSS3',
      desc: 'Styling web pages',
      description: 'Responsive design, flexbox, grid, and animations',
      icon: 'assets/images/css3.png',
      colorClass: 'css3',
      keySkills: [
        'CSS Grid and Flexbox layouts',
        'Responsive design & media queries',
        'CSS animations and transitions',
        'SASS/SCSS preprocessing',
        'CSS-in-JS and modern methodologies'
      ],
      experienceLevel: 'advanced',
      expanded: false
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      desc: 'Client-side scripting',
      description: 'ES6+, DOM manipulation, and modern JavaScript features',
      icon: 'assets/images/javascript.png',
      colorClass: 'javascript',
      keySkills: [
        'ES6+ features (arrow functions, destructuring)',
        'Async/await and Promise handling',
        'DOM manipulation and event handling',
        'Functional and OOP programming',
        'Module systems and bundling'
      ],
      experienceLevel: 'expert',
      expanded: false
    },
    {
      id: 'jquery',
      title: 'jQuery',
      desc: 'Simplified JavaScript',
      description: 'DOM manipulation, event handling, and AJAX requests',
      icon: 'assets/images/jquery.png',
      colorClass: 'jquery',
      keySkills: [
        'DOM traversal and manipulation',
        'Event handling and delegation',
        'AJAX requests and data handling',
        'Plugin development and integration',
        'Animation and effects'
      ],
      experienceLevel: 'intermediate',
      expanded: false
    },
    {
      id: 'bootstrap',
      title: 'Bootstrap',
      desc: 'CSS framework',
      description: 'Responsive UI components and mobile-first design',
      icon: 'assets/images/bootstrap.png',
      colorClass: 'bootstrap',
      keySkills: [
        'Grid system and responsive utilities',
        'Component library and customization',
        'Theme customization and SCSS variables',
        'JavaScript components integration',
        'Mobile-first responsive design'
      ],
      experienceLevel: 'advanced',
      expanded: false
    }
  ];

  levelPercent: Record<Skill['experienceLevel'], number> = {
    beginner: 40,
    intermediate: 70,
    advanced: 85,
    expert: 95
  };

  /** Element that had focus before the dialog opened, so focus can return to it. */
  private returnFocusTo: HTMLElement | null = null;

  /** Move keyboard focus into the dialog as soon as it renders. */
  @ViewChild('closeButton')
  set closeButton(ref: ElementRef<HTMLButtonElement> | undefined) {
    ref?.nativeElement.focus();
  }

  openSkill(skill: Skill): void {
    this.returnFocusTo = document.activeElement as HTMLElement | null;
    this.selectedSkill = skill;
    this.isModalOpen = true;
  }

  @HostListener('document:keydown.escape')
  closeModal(): void {
    if (!this.isModalOpen) return;
    this.isModalOpen = false;
    this.returnFocusTo?.focus();
    this.returnFocusTo = null;
  }

  /** The close button is the dialog's only focusable element, so Tab keeps focus on it. */
  trapFocus(event: Event): void {
    event.preventDefault();
  }
}
