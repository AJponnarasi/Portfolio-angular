import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import AOS from 'aos';
import Splide from '@splidejs/splide';

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  features: string[];
  technologies: string[];
  icon: string;
  image?: string;
  placeholder: {
    emoji: string;
    text: string;
  };
}

@Component({
  selector: 'app-project',
  imports: [CommonModule,],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projects: Project[] = [
    {
      id: 'zedbee-fms',
      title: 'ZEDBEE FMS',
      role: 'Front End Developer',
      description: 'IoT-based fleet management solution providing endless real-time monitoring, profit maximization, remote accessibility, and smarter maintenance management with easy device monitoring capabilities.',
      features: [
        'Owl Carousel',
        'Echarts Rendering',
        'Widget Creation',
        'QR Code Generation'
      ],
      technologies: ['HTML5', 'CSS', 'Bootstrap', 'jQuery', 'JavaScript'],
      icon: 'ZB',
      placeholder: {
        emoji: '🚛',
        text: 'IoT Fleet Management'
      }
    },
    {
      id: 'artu-k-selection',
      title: 'ARTU K Selection Tool',
      role: 'Front End Developer',
      description: 'Advanced panel creation and editing tool allowing users to create, modify, and view panels with downloadable component specifications and quantity tracking.',
      features: [
        'jQuery Step Wizard',
        'PDF Viewer Integration',
        'Plugin Integration'
      ],
      technologies: ['HTML5', 'CSS', 'Bootstrap', 'jQuery', 'JavaScript'],
      icon: 'ABB',
      placeholder: {
        emoji: '🔧',
        text: 'Panel Selection Tool'
      }
    },
    {
      id: 'fleet-monitoring',
      title: 'Fleet Monitoring System',
      role: 'Front End Developer',
      description: 'Location-based fleet tracking application enabling users to monitor trips, view comprehensive history, and receive customizable geofence notifications.',
      features: [
        'Google Maps Integration',
        'Echarts Rendering',
        'Geofence Notifications',
        'Trip History'
      ],
      technologies: ['HTML5', 'CSS', 'Bootstrap', 'jQuery', 'JavaScript'],
      icon: 'FM',
      placeholder: {
        emoji: '📍',
        text: 'Location Tracking'
      }
    },
    {
      id: 'yudash-admin',
      title: 'YuDash Admin Portal',
      role: 'Front End Developer',
      description: 'Comprehensive device monitoring portal for tracking device details, capturing snapshots, and providing real-time notifications when values exceed thresholds.',
      features: [
        'Echarts in Angular',
        'Device Monitoring',
        'Real-time Notifications',
        'Single Snap Capture'
      ],
      technologies: ['Angular v12', 'ng-bootstrap', 'TypeScript'],
      icon: 'YD',
      placeholder: {
        emoji: '📊',
        text: 'Admin Dashboard'
      }
    },
    {
      id: 'wavemaker-studio',
      title: 'Wavemaker Studio',
      role: 'Front End Developer',
      description: 'Low-code development platform providing visual interface and pre-built components to simplify application development and reduce manual coding requirements.',
      features: [
        'Visual Interface',
        'Pre-built Components',
        'Template System',
        'Low-code Platform'
      ],
      technologies: ['Angular', 'Jest'],
      icon: 'WM',
      placeholder: {
        emoji: '⚡',
        text: 'Low-Code Platform'
      }
    }
  ];

  stats = [
    { number: '5', label: 'Major Projects' },
    { number: '8+', label: 'Technologies' },
    { number: '3', label: 'Frameworks' },
    { number: '100%', label: 'Frontend Focus' }
  ];


  ngAfterViewInit() {

    setTimeout(() => {
      new Splide('.splide', {
        type: 'loop',
        perPage: 2,
        autoplay: true,
        gap: '2rem',
        breakpoints: {
          1024: { perPage: 2 },
          640: { perPage: 1 },
        }
      }).mount();
      AOS.refresh();

    }, 100); // ensures


  }

  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  trackByStat(index: number, stat: any): string {
    return stat.label;
  }

  onProjectClick(project: Project): void {
    // Handle project click - navigate to detail page or open modal
    console.log('Project clicked:', project.title);
  }

  onImageError(event: any): void {
    // Handle image load errors
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }
}
