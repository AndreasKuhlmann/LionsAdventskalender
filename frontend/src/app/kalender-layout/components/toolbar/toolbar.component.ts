import { ImpressumDialogComponent } from './../impressum-dialog/impressum-dialog.component';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FoerdererDialogComponent } from '../foerderer-dialog copy/foerderer-dialog.component';
import { ZweckDialogComponent } from '../zweck-dialog/zweck-dialog.component';
import { WerStehtDahinterDialogComponent } from '../wer-steht-dahinter-dialog/wer-steht-dahinter-dialog.component';
import { InstallablePromptService } from '../../services/installable-prompt.service';
import { take } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

declare var window: any;

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: false
})
export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();
  isDesktop = false
  showInstallButton = false;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private installablePromptService: InstallablePromptService,
    private _platform: Platform
  ) {
    if (!this._platform.IOS && !this._platform.ANDROID && !this.isPwa()) {
      this.showInstallButton = true;
      this.isDesktop = true;
    }
  }

  private isPwa(): boolean {
    if ((window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)) {
      window.addEventListener('resize', () => {
        // window.resizeTo(window.screen.availWidth * 0.55, window.screen.availHeight * 0.78);
        window.resizeTo( 1440, 1100);
      });
      return true;
    }
    return false
  }

  openZweckDialog(): void {
    this.dialog.open(ZweckDialogComponent, {
      width: '35rem',
    });
  }

  openFoerdererDialog(): void {
    this.dialog.open(FoerdererDialogComponent, {
      width: '35rem',
    });
  }

  openImpressumDialog(): void {
    this.dialog.open(ImpressumDialogComponent, {
      width: '35rem',
    });
  }
  werStehtDahinterDialog(): void {
    this.dialog.open(WerStehtDahinterDialogComponent, {
      width: '35rem',
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
  async installApp() {
    await this.installablePromptService.showPrompt().pipe(take(1)).subscribe((result => {
      if (result == true) {
        this.showInstallButton = false;
      }
    }));
  }
}
