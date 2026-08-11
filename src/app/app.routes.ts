import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'interview/:category', loadComponent: () => import('./features/interview-setup/interview-setup.component').then(m => m.InterviewSetupComponent) },
  { path: 'interview/:category/session', loadComponent: () => import('./features/interview-session/interview-session.component').then(m => m.InterviewSessionComponent) },
  { path: 'result', loadComponent: () => import('./features/result/result.component').then(m => m.ResultComponent) },
  { path: '**', redirectTo: '' }
];
