import { DestroyRef, Injectable, Injector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** Wie oft (zusätzlich zum Wechsel in den Vordergrund) nach einer neuen Version gesucht wird. */
const CHECK_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Sorgt dafür, dass neu deployte Versionen möglichst schnell bei den Nutzern ankommen.
 *
 * Ohne diesen Service lädt der Service Worker eine neue Version zwar im Hintergrund,
 * verwendet sie aber erst, wenn die App komplett geschlossen und neu geöffnet wird.
 * Installierte PWAs laufen auf Handys oft tagelang im Hintergrund weiter.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  /** Eine neue Version ist bereit, wurde aber noch nicht geladen. */
  private updateReady = false;

  /** Startet die Überwachung. Wird einmalig beim App-Start aufgerufen. */
  init(): void {
    if (!this.swUpdate.isEnabled) {
      return; // z.B. "ng serve" oder Browser ohne Service-Worker-Unterstützung
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onUpdateReady());

    // Der Service Worker kann die aktuelle Version nicht mehr ausliefern
    // (z.B. Dateien auf dem Server gelöscht) -> nur ein Neuladen hilft.
    this.swUpdate.unrecoverable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evt) => {
        console.warn('Service Worker in unrecoverable state:', evt.reason);
        document.location.reload();
      });

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      if (this.updateReady) {
        // Der Nutzer kehrt zur App zurück: guter Moment, um die neue Version zu laden.
        document.location.reload();
      } else {
        this.checkForUpdate();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const intervalId = setInterval(() => this.checkForUpdate(), CHECK_INTERVAL_MS);

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(intervalId);
    });
  }

  private async onUpdateReady(): Promise<void> {
    this.updateReady = true;
    if (document.visibilityState !== 'visible') {
      return; // wird beim nächsten Wechsel in den Vordergrund neu geladen
    }
    // Snackbar erst bei Bedarf nachladen - hält das Start-Bundle klein.
    const { MatSnackBar } = await import('@angular/material/snack-bar');
    this.injector
      .get(MatSnackBar)
      .open('Eine neue Version ist verfügbar.', 'Neu laden')
      .onAction()
      .subscribe(() => document.location.reload());
  }

  private async checkForUpdate(): Promise<void> {
    if (this.updateReady || !navigator.onLine) {
      return;
    }
    try {
      await this.swUpdate.checkForUpdate();
    } catch (err) {
      console.warn('Suche nach App-Update fehlgeschlagen:', err);
    }
  }
}
