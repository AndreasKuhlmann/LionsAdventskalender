import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-impressum-dialog',
  templateUrl: './impressum-dialog.component.html',
  styleUrls: ['./impressum-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, MatIconButton, MatIcon, CdkScrollable, MatDialogContent],
})
export class ImpressumDialogComponent {
  constructor(private dialogRef: MatDialogRef<ImpressumDialogComponent>) {}

  dismiss() {
    this.dialogRef.close(null);
  }
}
