import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'kalender-layout',
  template: '<sidenav></sidenav>',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SidenavComponent],
})
export class KalenderLayoutComponent {}
