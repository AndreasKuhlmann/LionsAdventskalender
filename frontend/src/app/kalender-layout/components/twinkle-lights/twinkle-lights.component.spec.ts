import { TestBed } from '@angular/core/testing';
import { TwinkleLightsComponent, buildLayers } from './twinkle-lights.component';
import { KALENDER_IMAGE_HEIGHT, KALENDER_IMAGE_WIDTH, TWINKLE_LIGHTS, TwinkleLight } from './twinkle-lights';

function decodeSvg(backgroundImage: string): string {
  const match = /^url\("data:image\/svg\+xml,(.*)"\)$/.exec(backgroundImage);
  expect(match).not.toBeNull();
  return decodeURIComponent(match![1]);
}

describe('TwinkleLightsComponent', () => {
  it('splits the lights into several independently twinkling layers', () => {
    const lights: TwinkleLight[] = Array.from({ length: 8 }, (_, i) => ({ x: i * 10, y: 5, kind: 'kette' }));
    const layers = buildLayers(lights);

    expect(layers.length).toBe(4); // Lichterkette: 4 Gruppen
    expect(new Set(layers.map((l) => l.duration)).size).toBe(4); // jede Gruppe mit eigenem Takt
    const circles = layers.map((l) => (decodeSvg(l.backgroundImage).match(/<circle/g) ?? []).length);
    expect(circles.reduce((a, b) => a + b, 0)).toBe(8); // jedes Licht genau einmal
  });

  it('puts neighbouring lights into different groups', () => {
    const lights: TwinkleLight[] = [
      { x: 10, y: 5, kind: 'kette' },
      { x: 20, y: 5, kind: 'kette' },
    ];
    const [first, second] = buildLayers(lights);
    expect(decodeSvg(first.backgroundImage)).toContain('cx="10"');
    expect(decodeSvg(second.backgroundImage)).toContain('cx="20"');
  });

  it('draws in the coordinate system of the calendar image', () => {
    const [layer] = buildLayers([{ x: 100, y: 200, kind: 'laterne' }]);
    expect(decodeSvg(layer.backgroundImage)).toContain(
      `viewBox="0 0 ${KALENDER_IMAGE_WIDTH} ${KALENDER_IMAGE_HEIGHT}"`
    );
  });

  it('shows nothing when no lights are defined (e.g. new picture)', () => {
    expect(buildLayers([])).toEqual([]);
  });

  it('keeps all lights of the current picture inside the image', () => {
    for (const light of TWINKLE_LIGHTS) {
      expect(light.x).toBeGreaterThanOrEqual(0);
      expect(light.x).toBeLessThanOrEqual(KALENDER_IMAGE_WIDTH);
      expect(light.y).toBeGreaterThanOrEqual(0);
      expect(light.y).toBeLessThanOrEqual(KALENDER_IMAGE_HEIGHT);
    }
  });

  it('renders one element per layer', async () => {
    const fixture = TestBed.createComponent(TwinkleLightsComponent);
    await fixture.whenStable();
    const rendered = (fixture.nativeElement as HTMLElement).querySelectorAll('.layer');
    expect(rendered.length).toBe(fixture.componentInstance.layers().length);
    expect(rendered.length).toBeGreaterThan(0);
  });
});
