import { TestBed } from '@angular/core/testing';
import { DoorSoundService } from './door-sound.service';

describe('DoorSoundService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('is not muted by default', () => {
    const service = TestBed.inject(DoorSoundService);
    expect(service.muted()).toBe(false);
  });

  it('remembers the mute setting', () => {
    TestBed.inject(DoorSoundService).toggleMuted();

    TestBed.resetTestingModule();
    expect(TestBed.inject(DoorSoundService).muted()).toBe(true);
  });

  it('does not touch the audio system while muted', () => {
    const AudioContextMock = vi.fn();
    vi.stubGlobal('AudioContext', AudioContextMock);
    const service = TestBed.inject(DoorSoundService);

    service.toggleMuted();
    service.playOpen();
    service.playClose();

    expect(AudioContextMock).not.toHaveBeenCalled();
  });

  it('silently does nothing when Web Audio is not available', () => {
    vi.stubGlobal('AudioContext', undefined);
    const service = TestBed.inject(DoorSoundService);
    expect(() => service.playOpen()).not.toThrow();
  });

  it('vibrates when a door opens or closes', () => {
    const vibrate = vi.fn().mockReturnValue(true);
    vi.stubGlobal('navigator', { ...navigator, vibrate });
    const service = TestBed.inject(DoorSoundService);

    service.playOpen();
    service.playOpen({ melody: false });
    service.playClose();

    expect(vibrate).toHaveBeenCalledTimes(3);
    expect(vibrate).toHaveBeenNthCalledWith(1, [40, 60, 40]);
  });

  it('does not vibrate while muted', () => {
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { ...navigator, vibrate });
    const service = TestBed.inject(DoorSoundService);

    service.toggleMuted();
    service.playOpen();

    expect(vibrate).not.toHaveBeenCalled();
  });

  it('ignores devices without vibration support', () => {
    vi.stubGlobal('navigator', { ...navigator, vibrate: undefined });
    const service = TestBed.inject(DoorSoundService);
    expect(() => service.playOpen()).not.toThrow();
  });

  describe('iOS audio session', () => {
    let audioSession: { type: string };

    beforeEach(() => {
      audioSession = { type: 'auto' };
      vi.stubGlobal('navigator', { ...navigator, audioSession });
    });

    it('switches to "playback" when a door sound plays (sound even if the iPhone is set to silent)', () => {
      const service = TestBed.inject(DoorSoundService);
      expect(audioSession.type).toBe('auto'); // nicht schon beim Laden - andere Musik läuft weiter

      service.playOpen();
      expect(audioSession.type).toBe('playback');
    });

    it('switches back to "ambient" when muted', () => {
      const service = TestBed.inject(DoorSoundService);
      service.playOpen();

      service.toggleMuted();
      expect(audioSession.type).toBe('ambient');

      service.playOpen(); // stumm: keine Änderung
      expect(audioSession.type).toBe('ambient');
    });
  });
});
