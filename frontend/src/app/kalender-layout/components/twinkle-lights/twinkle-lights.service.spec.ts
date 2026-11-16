import { TestBed } from '@angular/core/testing';
import { TWINKLE_LIGHTS } from './twinkle-lights';
import { TwinkleLightsService, formatLightsAsCode } from './twinkle-lights.service';

describe('TwinkleLightsService', () => {
  let service: TwinkleLightsService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(TwinkleLightsService);
  });

  it('starts with the lights from twinkle-lights.ts', () => {
    expect(service.lights()).toBe(TWINKLE_LIGHTS);
    expect(service.hasDraft()).toBe(false);
  });

  it('offers the editor in development mode (ng serve / tests)', () => {
    expect(service.editorAvailable).toBe(true);
    service.toggleEditMode();
    expect(service.editMode()).toBe(true);
    service.toggleEditMode();
    expect(service.editMode()).toBe(false);
  });

  it('adds a light of the selected kind on click', () => {
    service.clearAll();
    service.selectedKind.set('laterne');
    service.toggleLightAt(100.4, 200.6);
    expect(service.lights()).toEqual([{ x: 100, y: 201, kind: 'laterne' }]);
    expect(service.hasDraft()).toBe(true);
  });

  it('removes the nearest light when clicking on it', () => {
    service.clearAll();
    service.toggleLightAt(100, 100);
    service.toggleLightAt(300, 100);
    service.toggleLightAt(105, 103); // nahe am ersten Licht
    expect(service.lights()).toEqual([{ x: 300, y: 100, kind: 'kette' }]);
  });

  it('keeps the draft after a reload and can go back to the file version', () => {
    service.clearAll();
    service.toggleLightAt(50, 60);

    TestBed.resetTestingModule();
    const reloaded = TestBed.inject(TwinkleLightsService);
    expect(reloaded.lights()).toEqual([{ x: 50, y: 60, kind: 'kette' }]);
    expect(reloaded.hasDraft()).toBe(true);

    reloaded.resetToFile();
    expect(reloaded.lights()).toBe(TWINKLE_LIGHTS);
    expect(reloaded.hasDraft()).toBe(false);

    TestBed.resetTestingModule();
    expect(TestBed.inject(TwinkleLightsService).lights()).toBe(TWINKLE_LIGHTS);
  });

  it('exports the list as code for twinkle-lights.ts, grouped by kind', () => {
    const code = formatLightsAsCode([
      { x: 1, y: 2, kind: 'fenster' },
      { x: 3, y: 4, kind: 'kette' },
    ]);
    expect(code).toBe(
      [
        'export const TWINKLE_LIGHTS: readonly TwinkleLight[] = [',
        '  // Lichterkette',
        "  { x: 3, y: 4, kind: 'kette' },",
        '  // Fenster',
        "  { x: 1, y: 2, kind: 'fenster' },",
        '];',
      ].join('\n')
    );
  });
});
