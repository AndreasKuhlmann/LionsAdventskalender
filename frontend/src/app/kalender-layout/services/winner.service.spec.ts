import { TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, of } from 'rxjs';
import { ConfettiService } from './confetti.service';
import { DoorSoundService } from './door-sound.service';
import { Gewinn, GewinnService, TagesGewinne } from './gewinn.service';
import { MyNumberService } from './my-number.service';
import { WinnerService } from './winner.service';

describe('WinnerService', () => {
  let service: WinnerService;
  let myNumber: MyNumberService;
  let sound: { playOpen: ReturnType<typeof vi.fn>; playFanfare: ReturnType<typeof vi.fn> };
  let confetti: { burst: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };
  let snackAction: Subject<void>;
  let tagesGewinne: WritableSignal<TagesGewinne[]>;

  const tag3: Gewinn[] = [
    { Id: '1', Tag: 3, Losnummer: 42, Beschreibung: 'Gutschein Buchhandlung' },
    { Id: '2', Tag: 3, Losnummer: 7, Beschreibung: 'Gutschein Café' },
    { Id: '3', Tag: 3, Losnummer: 99, Beschreibung: 'Gutschein Kino' },
  ];

  /** Simuliert den Nummern-Dialog: führt "userActions" aus, bevor er geschlossen wird. */
  function dialogThatDoes(userActions: () => void) {
    return {
      afterClosed: () =>
        new Observable<void>((subscriber) => {
          userActions();
          subscriber.next();
          subscriber.complete();
        }),
    };
  }

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    sound = { playOpen: vi.fn(), playFanfare: vi.fn() };
    confetti = { burst: vi.fn() };
    dialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };
    snackAction = new Subject<void>();
    snackBar = { open: vi.fn().mockReturnValue({ onAction: () => snackAction }) };
    tagesGewinne = signal<TagesGewinne[]>([]);

    TestBed.configureTestingModule({
      providers: [
        { provide: DoorSoundService, useValue: sound },
        { provide: ConfettiService, useValue: confetti },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: GewinnService, useValue: { tagesGewinne } },
      ],
    });
    service = TestBed.inject(WinnerService);
    myNumber = TestBed.inject(MyNumberService);
  });

  afterEach(() => vi.useRealTimers());

  it('celebrates when one of the own numbers has won', () => {
    myNumber.add('42, 1234');
    service.doorOpened(3, tag3, true);

    // Tür knarrt ohne Melodie - Konfetti und Fanfare kommen nach dem Aufknarren
    expect(sound.playOpen).toHaveBeenCalledWith({ melody: false });
    expect(confetti.burst).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(confetti.burst).toHaveBeenCalledOnce();
    expect(sound.playFanfare).toHaveBeenCalledOnce();
    expect(dialog.open.mock.calls[0][1].data).toEqual({ wins: [{ tag: 3, gewinne: [tag3[0]] }] });
  });

  it('celebrates only once when several own numbers won on the same day', () => {
    myNumber.add('42, 7');
    service.doorOpened(3, tag3, true);
    vi.advanceTimersByTime(1000);

    expect(confetti.burst).toHaveBeenCalledOnce();
    expect(dialog.open).toHaveBeenCalledOnce();
    expect(dialog.open.mock.calls[0][1].data.wins[0].gewinne.map((g: Gewinn) => g.Losnummer)).toEqual([42, 7]);
  });

  it('tells the user when the single own number is not among the winners', () => {
    myNumber.add('1234');
    service.doorOpened(3, tag3, true);
    vi.advanceTimersByTime(2000);

    expect(sound.playOpen).toHaveBeenCalledWith();
    expect(confetti.burst).not.toHaveBeenCalled();
    expect(snackBar.open.mock.calls[0][0]).toContain('Ihre Nummer 1234 ist heute nicht dabei');
  });

  it('tells the user when none of several numbers is among the winners', () => {
    myNumber.add('1234, 5678, 9');
    service.doorOpened(3, tag3, true);
    expect(snackBar.open.mock.calls[0][0]).toContain('Keine Ihrer 3 Nummern ist heute dabei');
  });

  it('celebrates again when a winning door is closed and opens again', () => {
    myNumber.add('42');
    service.doorOpened(3, tag3, true);
    vi.advanceTimersByTime(1000);

    service.doorOpened(3, tag3, false);
    vi.advanceTimersByTime(1000);

    expect(confetti.burst).toHaveBeenCalledTimes(2);
    expect(sound.playFanfare).toHaveBeenCalledTimes(2);
    expect(dialog.open).toHaveBeenCalledTimes(2);
  });

  it('shows no repeated hint when a door without win is reopened', () => {
    myNumber.add('1234');
    service.doorOpened(3, tag3, false);
    vi.advanceTimersByTime(2000);

    expect(sound.playOpen).toHaveBeenCalledWith();
    expect(confetti.burst).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('suggests entering numbers only once', () => {
    service.doorOpened(3, tag3, true);
    service.doorOpened(4, tag3, true);
    expect(snackBar.open).toHaveBeenCalledOnce();
    expect(snackBar.open.mock.calls[0][1]).toBe('Eingeben');

    // "Eingeben" öffnet den Dialog
    snackAction.next();
    expect(dialog.open).toHaveBeenCalledOnce();
  });

  it('checks only newly added numbers against already opened doors (no spoilers)', () => {
    myNumber.add('7'); // war schon vorher hinterlegt - keine erneute Feier für Tag 3
    tagesGewinne.set([
      { Tag: 3, Gewinne: tag3, flipped: true },
      { Tag: 5, Gewinne: [{ Id: '9', Tag: 5, Losnummer: 42, Beschreibung: 'Noch geheim' }], flipped: false },
    ]);
    dialog.open.mockReturnValueOnce(dialogThatDoes(() => myNumber.add('42')));

    service.editNumbers();

    expect(confetti.burst).toHaveBeenCalledOnce();
    const data = dialog.open.mock.calls[1][1].data;
    expect(data.wins).toEqual([{ tag: 3, gewinne: [tag3[0]] }]); // nur 42, nicht Tag 5
  });

  it('confirms saving when no opened door has won', () => {
    dialog.open.mockReturnValueOnce(dialogThatDoes(() => myNumber.add('1234, 5678')));
    service.editNumbers();
    expect(confetti.burst).not.toHaveBeenCalled();
    expect(snackBar.open.mock.calls[0][0]).toContain('Gespeichert');
  });

  it('does nothing special when numbers were only removed', () => {
    myNumber.add('42, 1234');
    dialog.open.mockReturnValueOnce(dialogThatDoes(() => myNumber.remove(42)));
    service.editNumbers();
    expect(myNumber.numbers()).toEqual([1234]);
    expect(snackBar.open).not.toHaveBeenCalled();
    expect(confetti.burst).not.toHaveBeenCalled();
  });
});
