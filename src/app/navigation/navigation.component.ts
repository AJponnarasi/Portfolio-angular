import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() isMenuVisible: any;
  @Input() currentSection: any = 0;
  @Output() sectionChange = new EventEmitter<number>();

  navigationItems = [
    { path: 'home', icon: 'fas fa-house', label: 'Home' },
    { path: 'skills', icon: 'fas fa-user', label: 'Skills' },
    { path: 'service', icon: 'fas fa-heart', label: 'Services' },
    { path: 'experience', icon: 'fas fa-briefcase', label: 'Experience' },
    { path: 'projects', icon: 'fas fa-folder', label: 'Projects' },
    { path: 'contact', icon: 'fas fa-address-card', label: 'Contact' }
  ];

  onSectionClick(sectionIndex: number) {
    this.sectionChange.emit(sectionIndex);
  }

}
