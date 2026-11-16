import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  imports: [ToolbarComponent, RouterOutlet],
})
export class SidenavComponent {}
