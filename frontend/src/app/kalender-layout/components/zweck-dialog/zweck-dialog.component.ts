import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-zweck-dialog',
  templateUrl: './zweck-dialog.component.html',
  styleUrls: ['./zweck-dialog.component.scss'],
  imports: [MatDialogTitle, MatIconButton, MatIcon, CdkScrollable, MatDialogContent],
})
export class ZweckDialogComponent {
  constructor(private dialogRef: MatDialogRef<ZweckDialogComponent>) {}

  dismiss() {
    this.dialogRef.close(null);
  }
}
