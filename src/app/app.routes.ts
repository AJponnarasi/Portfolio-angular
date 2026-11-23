import { Routes } from '@angular/router';

/**
 * The portfolio is a single page; sections are reached with #anchors, not routes.
 * Any other path (e.g. old links to /home) redirects to the root.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', children: [] },
  { path: '**', redirectTo: '' }
];
