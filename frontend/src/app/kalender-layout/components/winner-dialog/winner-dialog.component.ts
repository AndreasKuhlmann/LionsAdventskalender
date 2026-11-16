import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Gewinn } from '../../services/gewinn.service';
import { formatKalendernummer } from '../../services/my-number.service';
import { ZweckDialogComponent } from '../zweck-dialog/zweck-dialog.component';

export interface WinnerDialogData {
  /** Gewinne auf eigene Nummern, nach Tag */
  wins: { tag: number; gewinne: Gewinn[] }[];
}

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
})
export class WinnerDialogComponent {
  readonly data = inject<WinnerDialogData>(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);

  readonly format = formatKalendernummer;

  /** Verschiedene eigene Nummern, die gewonnen haben (für die Einleitung). */
  readonly winningNumbers = [
    ...new Set(this.data.wins.flatMap((w) => w.gewinne.map((g) => g.Losnummer))),
  ].sort((a, b) => a - b);

  showPickupInfo(): void {
    this.dialog.open(ZweckDialogComponent, { width: '35rem' });
  }
}
