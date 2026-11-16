import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoorSoundService } from '../../services/door-sound.service';
import { DoorComponent } from './door.component';

describe('DoorComponent', () => {
  let fixture: ComponentFixture<DoorComponent>;
  let sound: { playOpen: ReturnType<typeof vi.fn>; playClose: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    sound = { playOpen: vi.fn(), playClose: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [DoorComponent],
      providers: [{ provide: DoorSoundService, useValue: sound }],
    }).compileComponents();
    fixture = TestBed.createComponent(DoorComponent);
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('plays no sound for a door that is already open when shown', async () => {
    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();
    expect(sound.playOpen).not.toHaveBeenCalled();
    expect(sound.playClose).not.toHaveBeenCalled();
  });

  it('creaks when the door opens and closes', async () => {
    await fixture.whenStable();

    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();
    expect(sound.playOpen).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('isOpen', false);
    await fixture.whenStable();
    expect(sound.playClose).toHaveBeenCalledOnce();
  });

  describe('door of a future day', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('tagesGewinne', [{ Id: '1', Tag: 24, Losnummer: 0, Beschreibung: '' }]);
      await fixture.whenStable();
      vi.useFakeTimers();
    });
    afterEach(() => vi.useRealTimers());

    it('creaks open without melody and slams shut by itself', () => {
      fixture.componentInstance.toggle();
      expect(sound.playOpen).toHaveBeenCalledExactlyOnceWith({ melody: false });
      expect(sound.playClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1300);
      expect(sound.playClose).toHaveBeenCalledOnce();
      expect(fixture.componentInstance.keepClose()).toBe(false);
    });

    it('slams shut immediately on a second click', () => {
      fixture.componentInstance.toggle();
      fixture.componentInstance.toggle();
      expect(sound.playClose).toHaveBeenCalledOnce();

      // der Timer ist gestoppt - kein zweites Zuschlagen
      vi.advanceTimersByTime(2000);
      expect(sound.playClose).toHaveBeenCalledOnce();
    });
  });

  it('plays no ajar sounds when an openable door is clicked', async () => {
    fixture.componentRef.setInput('tagesGewinne', [{ Id: '1', Tag: 1, Losnummer: 42, Beschreibung: 'Preis' }]);
    await fixture.whenStable();
    vi.useFakeTimers();
    try {
      fixture.componentInstance.toggle();
      vi.advanceTimersByTime(1300);
      expect(sound.playOpen).not.toHaveBeenCalled();
      expect(sound.playClose).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
