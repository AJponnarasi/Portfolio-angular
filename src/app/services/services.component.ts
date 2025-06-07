import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import AOS from 'aos';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  techStack: string[];
  featured?: boolean;
  delay: number
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  SERVICE_LIST: Service[] = [
    {
      id: 1,
      delay: 0,
      icon: `assets/images/code.png`,
      title: 'Angular Development',
      description: 'Building robust, scalable single-page applications with Angular. From component architecture to state management, I create dynamic user interfaces that deliver exceptional performance and user experience.',
      techStack: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
      featured: true
    },
    {
      id: 2,
      delay: 500,
      icon: `assets/images/responsive.png`,
      title: 'Frontend Architecture',
      description: 'Designing clean, maintainable code architectures with modern JavaScript frameworks. I focus on best practices, code organization, and creating scalable solutions that grow with your business needs.',
      techStack: ['JavaScript', 'HTML5', 'CSS3', 'SASS']
    },
    {
      id: 3,
      delay: 1000,
      icon: `assets/images/cloud-api.png`,
      title: 'API Integration',
      description: 'Seamlessly connecting frontend applications with backend services. I handle RESTful APIs, authentication, data management, and ensure smooth communication between client and server.',
      techStack: ['REST API', 'HTTP Client', 'JSON', 'Authentication']
    }
  ];
  hoveredCard :any


  ngAfterViewInit() {
    AOS.refresh();
  }

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }
  

  onCardHover(serviceId: number): void {
    this.hoveredCard = serviceId;
  }

  onCardLeave(serviceId: number): void {
    this.hoveredCard = null;
  }

}
