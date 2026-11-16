import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./kalender-layout/kalender-layout.routes').then(
        (m) => m.KALENDER_LAYOUT_ROUTES
      ),
  },
  { path: '**', redirectTo: '' },
];
