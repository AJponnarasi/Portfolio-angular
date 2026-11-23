import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  SOCIAL_MEDIA = [{
    name: "facebook",
    url: "https://www.facebook.com/ponnarasi.a.37",
    icon: 'fab fa-facebook-f'
  }, {
    name: "instagram",
    url: "https://www.instagram.com/aj_ponnarasi",
    icon: 'fab fa-instagram'
  }, {
    name: "twitter",
    url: "https://twitter.com/a_ponnarasi",
    icon: 'fab fa-twitter'
  }, {
    name: "linkedin",
    url: "https://www.linkedin.com/in/ponnarasi-a-489413192/",
    icon: 'fab fa-linkedin-in'
  }, {
    name: "mail",
    url: "https://mail.google.com/mail/u/0/?tab=om#inbox?compose=new",
    icon: 'fas fa-envelope'
  }]
}
