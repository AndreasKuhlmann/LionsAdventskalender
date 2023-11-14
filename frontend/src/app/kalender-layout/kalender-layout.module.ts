import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { DoorComponent } from './components/door/door.component';
import { ZweckDialogComponent } from './components/zweck-dialog/zweck-dialog.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GewinnService } from './services/gewinn.service';
import { KalenderComponent } from './components/kalender/kalender.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KalenderLayoutComponent } from './kalender-layout.component';
import { UserService } from './services/user.service';
import { ImpressumDialogComponent } from './components/impressum-dialog/impressum-dialog.component';
import { FoerdererDialogComponent } from './components/foerderer-dialog copy/foerderer-dialog.component';
import { WerStehtDahinterDialogComponent } from './components/wer-steht-dahinter-dialog/wer-steht-dahinter-dialog.component';

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
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [UserService, GewinnService],
  declarations: [
    KalenderLayoutComponent,
    DoorComponent,
    KalenderComponent,
    ToolbarComponent,
    SidenavComponent,
    ZweckDialogComponent,
    FoerdererDialogComponent,
    ImpressumDialogComponent,
    WerStehtDahinterDialogComponent,
  ],
})
export class KalenderLayoutModule {}
