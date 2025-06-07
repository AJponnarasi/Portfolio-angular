import { Component } from '@angular/core';
import { HomeComponent } from "./home/home.component";
import AOS from 'aos';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkillsComponent } from "./skills/skills.component";
import { ServicesComponent } from "./services/services.component";

@Component({
  selector: 'app-root',
  imports: [HomeComponent, CommonModule, SkillsComponent, ServicesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  isMenuVisible: boolean = false;

  ngOnInit() {
    AOS.init({
      duration: 1000, // optional: animation duration in ms
      once: true,     // optional: whether animation should happen only once
    });
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible
  }

}
