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

  describe('releasing the audio between sounds (no paused media player on the iOS lock screen)', () => {
    /** Nachgebauter AudioContext: jede Methode/jedes Feld liefert ein passendes Dummy-Objekt. */
    function fakeNode(): any {
      return new Proxy(
        {},
        {
          get: (target: any, prop) => {
            if (prop in target) return target[prop];
            if (prop === 'connect') return (next: unknown) => next;
            if (prop === 'getChannelData') return () => new Float32Array(16);
            return (target[prop] = typeof prop === 'string' && /^(frequency|gain|Q|detune)$/.test(prop) ? fakeNode() : () => {});
          },
        }
      );
    }
    let contexts: { state: string; close: ReturnType<typeof vi.fn> }[];
    let audioSession: { type: string };
    let mediaSession: { metadata: unknown; playbackState: string };

    beforeEach(() => {
      vi.useFakeTimers();
      contexts = [];
      class FakeAudioContext {
        state = 'running';
        currentTime = 0;
        sampleRate = 16;
        destination = fakeNode();
        close = vi.fn(() => {
          this.state = 'closed';
          return Promise.resolve();
        });
        resume = vi.fn(() => Promise.resolve());
        constructor() {
          contexts.push(this);
          return new Proxy(this, {
            get: (target: any, prop) => (prop in target ? target[prop] : () => fakeNode()),
          });
        }
      }
      vi.stubGlobal('AudioContext', FakeAudioContext);
      audioSession = { type: 'auto' };
      mediaSession = { metadata: {}, playbackState: 'playing' };
      vi.stubGlobal('navigator', { ...navigator, audioSession, mediaSession, vibrate: undefined });
    });

    afterEach(() => vi.useRealTimers());

    it('closes the audio shortly after the last sound and tells iOS that nothing is playing', () => {
      const service = TestBed.inject(DoorSoundService);
      service.playClose();
      expect(contexts.length).toBe(1);
      expect(audioSession.type).toBe('playback');

      vi.advanceTimersByTime(1500); // Geräusch klingt noch
      expect(contexts[0].close).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(contexts[0].close).toHaveBeenCalledOnce();
      expect(audioSession.type).toBe('auto');
      expect(mediaSession.playbackState).toBe('none');
      expect(mediaSession.metadata).toBeNull();
    });

    it('keeps the audio open while a melody is still playing', () => {
      const service = TestBed.inject(DoorSoundService);
      service.playOpen();
      vi.advanceTimersByTime(4000);
      expect(contexts[0].close).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20_000);
      expect(contexts[0].close).toHaveBeenCalledOnce();
    });

    it('uses a fresh audio context for the next door', () => {
      const service = TestBed.inject(DoorSoundService);
      service.playClose();
      vi.advanceTimersByTime(5000);

      service.playClose();
      expect(contexts.length).toBe(2);
      expect(contexts[1].state).toBe('running');
    });

    it('releases the audio right after stopping the music', () => {
      const service = TestBed.inject(DoorSoundService);
      expect(service.playChristmasEve()).toBeGreaterThan(30);

      service.stopMusic();
      vi.advanceTimersByTime(1500);
      expect(contexts[0].close).toHaveBeenCalledOnce();
    });
  });

  it('returns 0 seconds for Christmas Eve music when no audio is available', () => {
    vi.stubGlobal('AudioContext', undefined);
    const service = TestBed.inject(DoorSoundService);
    expect(service.playChristmasEve()).toBe(0);
    expect(() => service.stopMusic()).not.toThrow();
  });
});
