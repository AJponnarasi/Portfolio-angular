import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import Splide from '@splidejs/splide';
import AOS from 'aos';
import { yearsOfExperience } from '../shared/career';

export interface ProjectStat {
  number: string;
  label: string;
}

export interface ProjectVisual {
  /** Short category label shown in the card banner */
  label: string;
  /** Font Awesome class for the main icon */
  icon: string;
  /** Two smaller Font Awesome icons orbiting the main tile */
  accents: [string, string];
  /** Gradient start/end colours for the icon tile and banner tint */
  from: string;
  to: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  features: string[];
  technologies: string[];
  icon: string;
  image?: string;
  visual: ProjectVisual;
}

@Component({
  selector: 'app-project',
  imports: [CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnDestroy {
  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLElement>;
  private splide?: Splide;

  constructor() {
    // Runs only in the browser, once this component's DOM is rendered
    afterNextRender(() => {
      this.splide = new Splide(this.carousel.nativeElement, {
        type: 'loop',
        perPage: 2,
        autoplay: true,
        interval: 4500,
        pauseOnHover: true,
        gap: '1.75rem',
        breakpoints: {
          768: { perPage: 1, gap: '1rem' },
        }
      }).mount();
      // Carousel changes page height; re-measure scroll-reveal trigger points
      AOS.refreshHard();
    });
  }

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
      visual: {
        label: 'IoT Fleet Management',
        icon: 'fa-solid fa-truck-fast',
        accents: ['fa-solid fa-gauge-high', 'fa-solid fa-qrcode'],
        from: '#06b6d4',
        to: '#2563eb'
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
      visual: {
        label: 'Panel Selection Tool',
        icon: 'fa-solid fa-table-cells-large',
        accents: ['fa-solid fa-screwdriver-wrench', 'fa-solid fa-file-pdf'],
        from: '#f97316',
        to: '#e11d48'
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
      visual: {
        label: 'Location Tracking',
        icon: 'fa-solid fa-map-location-dot',
        accents: ['fa-solid fa-route', 'fa-solid fa-bell'],
        from: '#10b981',
        to: '#0d9488'
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
      visual: {
        label: 'Admin Dashboard',
        icon: 'fa-solid fa-chart-line',
        accents: ['fa-solid fa-chart-pie', 'fa-solid fa-bell'],
        from: '#8b5cf6',
        to: '#4f46e5'
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
      visual: {
        label: 'Low-Code Platform',
        icon: 'fa-solid fa-wand-magic-sparkles',
        accents: ['fa-solid fa-cubes', 'fa-solid fa-layer-group'],
        from: '#0ea5e9',
        to: '#1e40af'
      }
    }
  ];

  stats: ProjectStat[] = [
    { number: `${yearsOfExperience()}+`, label: 'Years Experience' },
    { number: '5+', label: 'Major Projects' },
    { number: '3', label: 'Companies' },
    { number: '8+', label: 'Technologies' }
  ];


  ngOnDestroy() {
    this.splide?.destroy();
  }

  trackByProject(_index: number, project: Project): string {
    return project.id;
  }

  trackByStat(_index: number, stat: ProjectStat): string {
    return stat.label;
  }
}
