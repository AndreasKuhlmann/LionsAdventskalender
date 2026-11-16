import { TestBed } from '@angular/core/testing';
import { MAX_ANZAHL_NUMMERN, MyNumberService, formatKalendernummer } from './my-number.service';

describe('MyNumberService', () => {
  beforeEach(() => localStorage.clear());

  it('has no numbers by default', () => {
    expect(TestBed.inject(MyNumberService).numbers()).toEqual([]);
  });

  it('adds several numbers at once, sorted and without duplicates', () => {
    const service = TestBed.inject(MyNumberService);
    const result = service.add('1234, 42;5678  42\n0007');

    expect(result.added).toEqual([1234, 42, 5678, 7]);
    expect(result.duplicates).toEqual([42]);
    expect(service.numbers()).toEqual([7, 42, 1234, 5678]);
    expect(service.count()).toBe(4);
  });

  it('reports invalid input and keeps the valid numbers', () => {
    const service = TestBed.inject(MyNumberService);
    const result = service.add('42, abc, 0, 123456, -5');

    expect(result.added).toEqual([42]);
    expect(result.invalid).toEqual(['abc', '0', '123456', '-5']);
    expect(service.numbers()).toEqual([42]);
  });

  it('reports already existing numbers', () => {
    const service = TestBed.inject(MyNumberService);
    service.add('42');
    expect(service.add('42').duplicates).toEqual([42]);
    expect(service.numbers()).toEqual([42]);
  });

  it('limits the number of entries', () => {
    const service = TestBed.inject(MyNumberService);
    const all = Array.from({ length: MAX_ANZAHL_NUMMERN + 2 }, (_, i) => i + 1).join(',');
    const result = service.add(all);

    expect(service.count()).toBe(MAX_ANZAHL_NUMMERN);
    expect(result.overLimit).toEqual([MAX_ANZAHL_NUMMERN + 1, MAX_ANZAHL_NUMMERN + 2]);
  });

  it('removes a number', () => {
    const service = TestBed.inject(MyNumberService);
    service.add('42, 1234');
    service.remove(42);
    expect(service.numbers()).toEqual([1234]);
  });

  it('remembers the numbers on this device', () => {
    TestBed.inject(MyNumberService).add('42, 1234');
    TestBed.resetTestingModule();
    expect(TestBed.inject(MyNumberService).numbers()).toEqual([42, 1234]);
  });

  it('takes over a single number saved by the previous version', () => {
    localStorage.setItem('adventskalender.meineKalendernummer', '42');
    expect(TestBed.inject(MyNumberService).numbers()).toEqual([42]);
    expect(localStorage.getItem('adventskalender.meineKalendernummer')).toBeNull();

    TestBed.resetTestingModule();
    expect(TestBed.inject(MyNumberService).numbers()).toEqual([42]);
  });

  it('finds the own wins (optionally only for given numbers)', () => {
    const service = TestBed.inject(MyNumberService);
    const gewinne = [
      { Id: '1', Tag: 1, Losnummer: 42, Beschreibung: 'A' },
      { Id: '2', Tag: 1, Losnummer: 7, Beschreibung: 'B' },
      { Id: '3', Tag: 1, Losnummer: 99, Beschreibung: 'C' },
    ];
    expect(service.winsIn(gewinne)).toEqual([]);

    service.add('42, 7');
    expect(service.winsIn(gewinne).map((g) => g.Id)).toEqual(['1', '2']);
    expect(service.winsIn(gewinne, [7]).map((g) => g.Id)).toEqual(['2']);
  });

  it('formats numbers like on the calendar', () => {
    expect(formatKalendernummer(42)).toBe('0042');
    expect(formatKalendernummer(1234)).toBe('1234');
  });
});
