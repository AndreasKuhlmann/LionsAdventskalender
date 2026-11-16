import { TestBed } from '@angular/core/testing';
import { InstallablePromptService } from './installable-prompt.service';

function createInstallEvent(outcome: 'accepted' | 'dismissed') {
  const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: string }>;
  };
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  return event;
}

describe('InstallablePromptService', () => {
  let service: InstallablePromptService;

  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstallablePromptService);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('offers installation only after the browser fired beforeinstallprompt', () => {
    expect(service.canInstall()).toBe(false);

    const event = createInstallEvent('accepted');
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(service.canInstall()).toBe(true);
  });

  it('shows the browser prompt and reports the outcome', async () => {
    const event = createInstallEvent('accepted');
    window.dispatchEvent(event);

    await expect(service.install()).resolves.toBe(true);
    expect(event.prompt).toHaveBeenCalledOnce();
    // Das Event ist verbraucht
    expect(service.canInstall()).toBe(false);
  });

  it('returns false when the user dismisses the browser prompt', async () => {
    window.dispatchEvent(createInstallEvent('dismissed'));
    await expect(service.install()).resolves.toBe(false);
  });

  it('hides the install button after the app was installed', () => {
    window.dispatchEvent(createInstallEvent('accepted'));
    window.dispatchEvent(new Event('appinstalled'));
    expect(service.canInstall()).toBe(false);
    expect(service.isStandalone()).toBe(true);
  });
});
