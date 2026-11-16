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
});
