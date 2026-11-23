import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ResumeService } from '../shared/resume.service';
import { yearsOfExperience } from '../shared/career';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly resume = inject(ResumeService);

  /** Keeps the hero stat current automatically. */
  readonly yearsOfExperience = yearsOfExperience();
}
