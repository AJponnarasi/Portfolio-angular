import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly currentYear: number = new Date().getFullYear();
  // Professional profiles only. Personal Facebook/Instagram were removed from the public portfolio.
  SOCIAL_MEDIA = [{
    name: "X (Twitter)",
    url: "https://x.com/a_ponnarasi",
    icon: 'fab fa-x-twitter'
  }, {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/ponnarasi-a-489413192/",
    icon: 'fab fa-linkedin-in'
  }, {
    name: "Email",
    url: "mailto:ajpkponnarasi6@gmail.com",
    icon: 'fas fa-envelope'
  }]
}
