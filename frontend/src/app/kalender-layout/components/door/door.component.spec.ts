import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoorSoundService } from '../../services/door-sound.service';
import { MyNumberService } from '../../services/my-number.service';
import { WinnerService } from '../../services/winner.service';
import { DoorComponent } from './door.component';

describe('DoorComponent', () => {
  let fixture: ComponentFixture<DoorComponent>;
  let sound: { playOpen: ReturnType<typeof vi.fn>; playClose: ReturnType<typeof vi.fn> };
  let winner: { doorOpened: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localStorage.clear();
    sound = { playOpen: vi.fn(), playClose: vi.fn() };
    winner = { doorOpened: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [DoorComponent],
      providers: [
        { provide: DoorSoundService, useValue: sound },
        { provide: WinnerService, useValue: winner },
      ],
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
    expect(winner.doorOpened).not.toHaveBeenCalled();
    expect(sound.playClose).not.toHaveBeenCalled();
  });

  it('reports the opening (sound + win check) and creaks when closing', async () => {
    const gewinne = [{ Id: '1', Tag: 3, Losnummer: 42, Beschreibung: 'Preis' }];
    fixture.componentRef.setInput('no', 3);
    fixture.componentRef.setInput('tagesGewinne', gewinne);
    await fixture.whenStable();

    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();
    expect(winner.doorOpened).toHaveBeenCalledExactlyOnceWith(3, gewinne, true);

    fixture.componentRef.setInput('isOpen', false);
    await fixture.whenStable();
    expect(sound.playClose).toHaveBeenCalledOnce();

    // erneutes Öffnen derselben Tür: keine zweite Feier
    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();
    expect(winner.doorOpened).toHaveBeenLastCalledWith(3, gewinne, false);
  });

  it('lights up with rising sparks when opened, then keeps a calm glow', async () => {
    const el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    expect(el.querySelectorAll('.spark').length).toBe(0);

    vi.useFakeTimers();
    try {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      expect(el.querySelectorAll('.spark').length).toBeGreaterThan(0);
      expect(el.querySelector('.door-glow')?.classList).toContain('burst');
      expect(el.querySelector('.door-wrapper')?.classList).toContain('lit');

      vi.advanceTimersByTime(2000);
      fixture.detectChanges();
      expect(el.querySelectorAll('.spark').length).toBe(0);
      expect(el.querySelector('.door-glow')?.classList).not.toContain('burst');
      expect(el.querySelector('.door-glow')?.classList).toContain('visible'); // ruhiger Schein bleibt
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows no sparks for a door that is already open when shown', async () => {
    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.spark').length).toBe(0);
    expect(el.querySelector('.door-glow')?.classList).toContain('visible');
  });

  it('shows the twinkling lights on the door face, aligned with its picture section', async () => {
    fixture.componentRef.setInput('backgroundWidth', 1200);
    await fixture.whenStable();
    const face = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.door')!;

    expect(face.querySelector('app-twinkle-lights')).not.toBeNull();
    expect(face.style.getPropertyValue('--twinkle-size')).toBe('1200px auto');
    expect(face.style.getPropertyValue('--twinkle-position')).toBe(face.style.backgroundPosition);
  });

  it('highlights the own winning number in an open door', async () => {
    TestBed.inject(MyNumberService).add('42');
    fixture.componentRef.setInput('tagesGewinne', [
      { Id: '1', Tag: 3, Losnummer: 42, Beschreibung: 'Mein Preis' },
      { Id: '2', Tag: 3, Losnummer: 7, Beschreibung: 'Anderer Preis' },
    ]);
    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();

    const highlighted = (fixture.nativeElement as HTMLElement).querySelectorAll('.my-win');
    expect(highlighted.length).toBe(1);
    expect(highlighted[0].textContent).toContain('Mein Preis');
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

    it('lets the light shine out while ajar and turns it off when slamming shut', () => {
      const el = fixture.nativeElement as HTMLElement;
      fixture.componentInstance.toggle();
      fixture.detectChanges();
      expect(el.querySelector('.door-wrapper')?.classList).toContain('lit');
      expect(el.querySelector('.door-wrapper')?.classList).toContain('burst');
      expect(el.querySelectorAll('.spark').length).toBeGreaterThan(0);

      vi.advanceTimersByTime(1300);
      fixture.detectChanges();
      expect(el.querySelector('.door-wrapper')?.classList).not.toContain('lit');
      expect(el.querySelector('.door-wrapper')?.classList).not.toContain('burst');
      expect(el.querySelector('.door-glow')?.classList).not.toContain('visible');
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
