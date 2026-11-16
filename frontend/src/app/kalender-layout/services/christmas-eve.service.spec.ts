import { TestBed } from '@angular/core/testing';
import { ChristmasEveService, isAfterChristmas } from './christmas-eve.service';
import { DoorSoundService } from './door-sound.service';

describe('ChristmasEveService', () => {
  let service: ChristmasEveService;
  let sound: { playChristmasEve: ReturnType<typeof vi.fn>; stopMusic: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers();
    sound = { playChristmasEve: vi.fn().mockReturnValue(45), stopMusic: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: DoorSoundService, useValue: sound }] });
    service = TestBed.inject(ChristmasEveService);
  });

  afterEach(() => vi.useRealTimers());

  it('plays bells and "Stille Nacht" and ends shortly after the music', () => {
    service.start();
    expect(service.active()).toBe(true);
    expect(sound.playChristmasEve).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(45_000);
    expect(service.active()).toBe(true);
    vi.advanceTimersByTime(3_000);
    expect(service.active()).toBe(false);
    expect(sound.stopMusic).toHaveBeenCalledOnce();
  });

  it('does not restart while the scene is running', () => {
    service.start();
    service.start();
    expect(sound.playChristmasEve).toHaveBeenCalledOnce();
  });

  it('can be closed early, which also stops the music', () => {
    service.start();
    service.end();
    expect(service.active()).toBe(false);
    expect(sound.stopMusic).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(60_000); // kein zweites Beenden durch den Timer
    expect(sound.stopMusic).toHaveBeenCalledOnce();
  });

  it('still shows the scene for a while when there is no sound (muted)', () => {
    sound.playChristmasEve.mockReturnValue(0);
    service.start();
    vi.advanceTimersByTime(29_000);
    expect(service.active()).toBe(true);
    vi.advanceTimersByTime(1_000);
    expect(service.active()).toBe(false);
  });
});

describe('isAfterChristmas', () => {
  it('is true from Dec 25 until the end of January', () => {
    expect(isAfterChristmas(new Date(2026, 11, 24))).toBe(false);
    expect(isAfterChristmas(new Date(2026, 11, 25))).toBe(true);
    expect(isAfterChristmas(new Date(2027, 0, 31))).toBe(true);
    expect(isAfterChristmas(new Date(2027, 1, 1))).toBe(false);
    expect(isAfterChristmas(new Date(2026, 11, 1))).toBe(false);
  });
});
