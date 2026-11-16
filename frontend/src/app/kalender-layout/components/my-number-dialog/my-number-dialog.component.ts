import { Component, inject, signal } from '@angular/core';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatButton } from '@angular/material/button';
import {
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipRow,
} from '@angular/material/chips';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  MAX_ANZAHL_NUMMERN,
  MAX_KALENDERNUMMER,
  MyNumberService,
  formatKalendernummer,
} from '../../services/my-number.service';

/**
 * Verwaltung der eigenen Kalendernummern (hinzufügen/entfernen).
 * Änderungen werden sofort gespeichert; welche Nummern neu sind, ermittelt der Aufrufer
 * durch Vergleich vorher/nachher.
 */
@Component({
  selector: 'app-my-number-dialog',
  templateUrl: './my-number-dialog.component.html',
  styleUrls: ['./my-number-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatHint,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatChipInput,
    MatIcon,
    MatButton,
  ],
})
export class MyNumberDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<MyNumberDialogComponent>>(MatDialogRef);
  private readonly myNumber = inject(MyNumberService);

  readonly numbers = this.myNumber.numbers;
  readonly separatorKeys = [ENTER, COMMA, SEMICOLON, SPACE];
  readonly maxAnzahl = MAX_ANZAHL_NUMMERN;
  readonly format = formatKalendernummer;

  /** Rückmeldung zur letzten Eingabe (Fehler/Hinweis) */
  readonly message = signal<string | null>(null);

  /** Enter, Komma, Leerzeichen oder Verlassen des Feldes */
  addFromChipInput(event: MatChipInputEvent): void {
    this.addValue(event.value);
    if (!this.message()?.startsWith('Ungültig')) {
      event.chipInput.clear();
    }
  }

  /** "Hinzufügen"-Button (v.a. für Handys, deren Zahlentastatur kein Enter/Komma hat) */
  addFromButton(input: HTMLInputElement): void {
    this.addValue(input.value);
    if (!this.message()?.startsWith('Ungültig')) {
      input.value = '';
    }
    input.focus();
  }

  remove(value: number): void {
    this.myNumber.remove(value);
    this.message.set(null);
  }

  done(): void {
    this.dialogRef.close();
  }

  private addValue(value: string): void {
    if (!value.trim()) {
      this.message.set(null);
      return;
    }
    const result = this.myNumber.add(value);

    const parts: string[] = [];
    if (result.invalid.length > 0) {
      parts.push(
        `Ungültig: ${result.invalid.join(', ')} – bitte nur Zahlen von 1 bis ${MAX_KALENDERNUMMER}.`
      );
    }
    if (result.duplicates.length > 0) {
      parts.push(`Bereits vorhanden: ${result.duplicates.map(formatKalendernummer).join(', ')}.`);
    }
    if (result.overLimit.length > 0) {
      parts.push(`Höchstens ${MAX_ANZAHL_NUMMERN} Nummern möglich.`);
    }
    this.message.set(parts.length > 0 ? parts.join(' ') : null);
  }
}
