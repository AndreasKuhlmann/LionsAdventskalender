import { ImpressumDialogComponent } from './../impressum-dialog/impressum-dialog.component';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FoerdererDialogComponent } from '../foerderer-dialog copy/foerderer-dialog.component';
import { ZweckDialogComponent } from '../zweck-dialog/zweck-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  openZweckDialog(): void {
    this.dialog.open(ZweckDialogComponent, {
      width: '28em',
    });
  }

  openFoerdererDialog(): void {
    this.dialog.open(FoerdererDialogComponent, {
      width: '35em',
    });
  }

  openImpressumDialog(): void {
    this.dialog.open(ImpressumDialogComponent, {
      width: '28em',
    });
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(ZweckDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);

      if (result) {
        this.openSnackBar("Contact added", "Navigate")
          .onAction().subscribe(() => {
              this.router.navigate(['/contactmanager', result.id]);
          });
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
