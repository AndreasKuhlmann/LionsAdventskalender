import { CHRISTMAS_MELODIES, noteToFrequency, parseMelody } from './christmas-melodies';
import { pickRandomIndex } from './door-sound.service';

describe('christmas melodies', () => {
  it('converts note names to frequencies', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440);
    expect(noteToFrequency('A5')).toBeCloseTo(880);
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 1);
    expect(noteToFrequency('F#4')).toBeCloseTo(369.99, 1);
    expect(noteToFrequency('Bb3')).toBeCloseTo(233.08, 1);
    expect(() => noteToFrequency('H4')).toThrow();
  });

  it.each(CHRISTMAS_MELODIES.map((m) => [m.title, m] as const))(
    '"%s" is valid and short',
    (_title, melody) => {
      const notes = parseMelody(melody);
      const seconds = notes.reduce((sum, n) => sum + n.duration, 0);
      expect(notes.length).toBeGreaterThan(5);
      expect(seconds).toBeGreaterThan(2);
      expect(seconds).toBeLessThanOrEqual(8);
    }
  );

  it('never picks the same melody twice in a row', () => {
    let last = -1;
    for (let i = 0; i < 200; i++) {
      const next = pickRandomIndex(CHRISTMAS_MELODIES.length, last);
      expect(next).not.toBe(last);
      expect(next).toBeGreaterThanOrEqual(0);
      expect(next).toBeLessThan(CHRISTMAS_MELODIES.length);
      last = next;
    }
  });
});
