import { ImpressumDialogComponent } from './../impressum-dialog/impressum-dialog.component';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FoerdererDialogComponent } from '../foerderer-dialog/foerderer-dialog.component';
import { ZweckDialogComponent } from '../zweck-dialog/zweck-dialog.component';
import { WerStehtDahinterDialogComponent } from '../wer-steht-dahinter-dialog/wer-steht-dahinter-dialog.component';
import { InstallablePromptService } from '../../services/installable-prompt.service';
import {
  InstallablePromptComponent,
  InstallablePromptData,
} from '../installable-prompt/installable-prompt.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    imports: [MatToolbar, MatIconButton, MatTooltip, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class ToolbarComponent {
  private readonly installablePromptService = inject(InstallablePromptService);

  /** Install-Button nur anbieten, wenn der Browser die Installation erlaubt (bzw. auf iOS als Anleitung). */
  readonly showInstallButton = this.installablePromptService.canInstall;
  readonly isDesktop = !this.installablePromptService.isMobile;

  constructor(private dialog: MatDialog) {}

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
  /** Eigener Dialog (auf iOS mit Anleitung), danach – nur bei "Installieren" – der Dialog des Browsers. */
  installApp(): void {
    const data: InstallablePromptData = { ios: this.installablePromptService.isIos };
    this.dialog
      .open<InstallablePromptComponent, InstallablePromptData, boolean>(InstallablePromptComponent, {
        width: '320px',
        data,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed === true) {
          this.installablePromptService.install();
        }
      });
  }
}
