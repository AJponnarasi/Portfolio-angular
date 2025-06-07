import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import AOS from 'aos';

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
  isModalOpen:boolean = false;
  selectedSkill: any;
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
      desc:'Simplified JavaScript',
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

  ngAfterViewInit() {
    AOS.refresh();
  }

  toggleSkillDetails(skillId: string): void {
    this.isModalOpen = !this.isModalOpen
    // Toggle current skill
    this.selectedSkill = this.SKILLS_LIST.find(s => s.id === skillId);
    
  }

  closeModal(){
    this.isModalOpen = false
  }

}
