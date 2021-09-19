import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { AdventDaysService } from '../services/advent-days.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { AdventskalenderComponent } from './components/adventskalender/adventskalender.component';
import { DoorComponent } from './components/door/door.component';

const routes: Routes = [
  {
    path: '', component: AdventskalenderComponent,
  },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AdventDaysService,
  ],
  declarations: [DoorComponent, AdventskalenderComponent],
})
export class AdventskalenderModule {}
