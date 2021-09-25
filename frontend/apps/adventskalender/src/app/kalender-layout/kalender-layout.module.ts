import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { DoorComponent } from './components/door/door.component';
import { NewContactDialogComponent } from './components/new-contact-dialog/new-contact-dialog.component';
import { NotesComponent } from './components/notes/notes.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AdventDaysService } from './services/advent-days.service';
import { KalenderComponent } from './components/kalender/kalender.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KalenderLayoutComponent } from './kalender-layout.component';
import { UserService } from './services/user.service';

const routes: Routes = [
  {
    path: '',
    component: KalenderLayoutComponent,
    children: [{ path: '', component: KalenderComponent }],
  },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [UserService, AdventDaysService],
  declarations: [
    KalenderLayoutComponent,
    DoorComponent,
    KalenderComponent,
    ToolbarComponent,
    SidenavComponent,
    NotesComponent,
    NewContactDialogComponent,
  ],
})
export class KalenderLayoutModule {}
