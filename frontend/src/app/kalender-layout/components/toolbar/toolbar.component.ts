import { ImpressumDialogComponent } from './../impressum-dialog/impressum-dialog.component';
import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FoerdererDialogComponent } from '../foerderer-dialog/foerderer-dialog.component';
import { ZweckDialogComponent } from '../zweck-dialog/zweck-dialog.component';
import { WerStehtDahinterDialogComponent } from '../wer-steht-dahinter-dialog/wer-steht-dahinter-dialog.component';
import { InstallablePromptService } from '../../services/installable-prompt.service';
import { take } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

declare var window: any;

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    imports: [MatToolbar, MatIconButton, MatTooltip, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class ToolbarComponent {
  readonly isDesktop = signal(false);
  readonly showInstallButton = signal(false);
  constructor(
    private dialog: MatDialog,
    private installablePromptService: InstallablePromptService,
    private _platform: Platform
  ) {
    if (!this._platform.IOS && !this._platform.ANDROID && !this.isPwa()) {
      this.showInstallButton.set(true);
      this.isDesktop.set(true);
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
  async installApp() {
    await this.installablePromptService.showPrompt().pipe(take(1)).subscribe((result => {
      if (result == true) {
        this.showInstallButton.set(false);
      }
    }));
  }
}
