import { Injectable, computed, inject, signal } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

/** Das (nicht standardisierte) Event, das Chromium-Browser vor der Installation auslösen. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Kümmert sich um die Installation als PWA.
 * Wird beim App-Start erzeugt, damit das frühe "beforeinstallprompt"-Event nicht verpasst wird.
 * Bewusst ohne Material-Abhängigkeiten, damit das Start-Bundle klein bleibt
 * (der Dialog wird von der Toolbar geöffnet).
 */
@Injectable({
  providedIn: 'root',
})
export class InstallablePromptService {
  private readonly platform = inject(Platform);

  /** Vom Browser zurückgehaltenes Install-Event (nur Chromium: Chrome, Edge, Samsung Internet ...). */
  private readonly deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);

  /** Läuft die App bereits als installierte PWA? */
  readonly isStandalone = signal(isRunningStandalone());

  /** iOS bietet keine Install-API - dort kann nur eine Anleitung angezeigt werden. */
  readonly isIos = this.platform.IOS;

  /** Mobilgerät (für die Wahl des Icons). */
  readonly isMobile = this.platform.IOS || this.platform.ANDROID;

  /** Soll ein Install-Button angeboten werden? */
  readonly canInstall = computed(
    () => !this.isStandalone() && (this.deferredPrompt() !== null || this.isIos)
  );

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Standard-Banner unterdrücken, Event für den eigenen Button aufheben.
      e.preventDefault();
      this.deferredPrompt.set(e as BeforeInstallPromptEvent);
    });
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt.set(null);
      this.isStandalone.set(true);
    });
  }

  /**
   * Zeigt den Install-Dialog des Browsers. Liefert true, wenn die App installiert wurde.
   * Auf iOS (keine Install-API) immer false.
   */
  async install(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      return false;
    }
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log('User response to the install prompt:', outcome);
    // Das Event kann nur einmal verwendet werden.
    this.deferredPrompt.set(null);
    return outcome === 'accepted';
  }
}

function isRunningStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
