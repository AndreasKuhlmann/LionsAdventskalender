import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-wer-steht-dahinter-dialog',
  templateUrl: './wer-steht-dahinter-dialog.component.html',
  styleUrls: ['./wer-steht-dahinter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, MatIconButton, MatIcon, CdkScrollable, MatDialogContent],
})
export class WerStehtDahinterDialogComponent {
  constructor(private dialogRef: MatDialogRef<WerStehtDahinterDialogComponent>) {}

  dismiss() {
    this.dialogRef.close(null);
  }
}
