import { Routes } from '@angular/router';
import { KalenderComponent } from './components/kalender/kalender.component';
import { KalenderLayoutComponent } from './kalender-layout.component';

export const KALENDER_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: KalenderLayoutComponent,
    children: [{ path: '', component: KalenderComponent }],
  },
  { path: '**', redirectTo: '' },
];
