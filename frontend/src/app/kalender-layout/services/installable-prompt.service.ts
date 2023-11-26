import { Injectable } from '@angular/core';
import { InstallablePromptComponent } from '../components/installable-prompt/installable-prompt.component';
import { Observable, from, map, mergeMap, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class InstallablePromptService {

  installablePrompt: any;


  constructor(private dialog: MatDialog) {
    this.init();
  }

  init() {
    window.addEventListener(
      'beforeinstallprompt',
      this.handleInstallPrompt.bind(this)
    );
  }

  showPrompt(): Observable<boolean> {
    const dialogRef = this.dialog.open(InstallablePromptComponent, {
      width: '300px',
    });
    return dialogRef.afterClosed().pipe(
      mergeMap(() => this.installablePrompt.prompt()),
      mergeMap(() => {
        return from(this.installablePrompt.userChoice);
      }),
      map((outcome: any) => {
        console.log('User response to the install prompt:', outcome);
        this.installablePrompt = null;
        return true
      }));
  }

  handleInstallPrompt(e: any) {
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.installablePrompt = e;
    console.log('installable prompt event fired');
    window.removeEventListener('beforeinstallprompt', this.handleInstallPrompt);
  }
}
