import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-foerderer-dialog',
  templateUrl: './foerderer-dialog.component.html',
  styleUrls: ['./foerderer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, MatIconButton, MatIcon, CdkScrollable, MatDialogContent],
})
export class FoerdererDialogComponent {
  constructor(private dialogRef: MatDialogRef<FoerdererDialogComponent>) {}

  dismiss() {
    this.dialogRef.close(null);
  }
}
