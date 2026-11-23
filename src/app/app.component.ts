import { Component, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import AOS from 'aos';
import { HomeComponent } from './home/home.component';
import { SkillsComponent } from './skills/skills.component';
import { ServicesComponent } from './services/services.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProjectComponent } from './project/project.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { ResumeService } from './shared/resume.service';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  imports: [HomeComponent, CommonModule, SkillsComponent, ServicesComponent, ExperienceComponent, ProjectComponent, ContactComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isMenuVisible = false;
  isScrolled = false;
  scrollProgress = 0;
  activeSection = 'home';

  NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'fas fa-house' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-code' },
    { id: 'services', label: 'Expertise', icon: 'fas fa-layer-group' },
    { id: 'experience', label: 'Journey', icon: 'fas fa-briefcase' },
    { id: 'projects', label: 'Work', icon: 'fas fa-folder-open' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-paper-plane' }
  ];

  readonly resume = inject(ResumeService);
  readonly theme = inject(ThemeService);
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    AOS.init({ duration: 900, once: true, offset: 60 });
    // Images/fonts change layout after init; re-measure so nothing stays hidden
    if (document.readyState === 'complete') {
      setTimeout(() => AOS.refreshHard());
    } else {
      window.addEventListener('load', () => AOS.refreshHard(), { once: true });
    }
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isBrowser) return;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.isScrolled = y > 20;
    this.scrollProgress = max > 0 ? (y / max) * 100 : 0;

    // Scroll-spy: last section whose top has passed 40% of the viewport
    const marker = y + window.innerHeight * 0.4;
    for (const item of this.NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el && el.offsetTop <= marker) this.activeSection = item.id;
    }
  }
}
