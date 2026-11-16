import { TestBed } from '@angular/core/testing';
import { DoorSoundService } from './door-sound.service';

describe('DoorSoundService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('cannot be muted any more - an old saved mute setting is removed', () => {
    localStorage.setItem('adventskalender.soundMuted', 'true');
    const service = TestBed.inject(DoorSoundService);

    expect(localStorage.getItem('adventskalender.soundMuted')).toBeNull();
    expect('muted' in service).toBe(false);
    expect('toggleMuted' in service).toBe(false);
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
  });

  it('returns 0 seconds for Christmas Eve music when no audio is available', () => {
    vi.stubGlobal('AudioContext', undefined);
    const service = TestBed.inject(DoorSoundService);
    expect(service.playChristmasEve()).toBe(0);
    expect(() => service.stopMusic()).not.toThrow();
  });
});
