import { Component } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'kalender-layout',
  template: '<sidenav></sidenav>',
  imports: [SidenavComponent],
})
export class KalenderLayoutComponent {}
