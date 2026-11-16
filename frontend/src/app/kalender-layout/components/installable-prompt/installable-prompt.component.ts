import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export interface InstallablePromptData {
  /** iOS hat keine Install-API: statt "Installieren" eine Anleitung anzeigen. */
  ios: boolean;
}

@Component({
  selector: 'app-installable-prompt',
  templateUrl: './installable-prompt.component.html',
  styleUrls: ['./installable-prompt.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, MatIcon],
})
export class InstallablePromptComponent {
  readonly data = inject<InstallablePromptData | null>(MAT_DIALOG_DATA, { optional: true });
}
