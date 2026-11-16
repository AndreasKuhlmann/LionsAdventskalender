import { TestBed } from '@angular/core/testing';
import { KALENDER_IMAGE_HEIGHT, KALENDER_IMAGE_WIDTH } from './twinkle-lights';
import { TwinkleLightsEditorComponent } from './twinkle-lights-editor.component';
import { TwinkleLightsService } from './twinkle-lights.service';
import { ChristmasEveService } from '../../services/christmas-eve.service';

describe('TwinkleLightsEditorComponent', () => {
  let service: TwinkleLightsService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(TwinkleLightsService);
    service.clearAll();
  });

  /** Simuliert einen Klick in eine Fläche mit gegebener Größe (in Bildschirmpixeln). */
  function clickAt(component: TwinkleLightsEditorComponent, width: number, clientX: number, clientY: number) {
    const area = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width, height: 10000 }) as DOMRect,
    } as HTMLElement;
    component.onAreaClick({ currentTarget: area, clientX, clientY } as unknown as MouseEvent);
  }

  it('converts a click on the screen into image coordinates', () => {
    const component = TestBed.createComponent(TwinkleLightsEditorComponent).componentInstance;
    // Bild auf halbe Größe skaliert (600 px breit)
    clickAt(component, KALENDER_IMAGE_WIDTH / 2, 100, 50);
    expect(service.lights()).toEqual([{ x: 200, y: 100, kind: 'kette' }]);
  });

  it('maps clicks on a repeated image (mobile view) back to the original picture', () => {
    const component = TestBed.createComponent(TwinkleLightsEditorComponent).componentInstance;
    const width = KALENDER_IMAGE_WIDTH / 2;
    const imageHeightOnScreen = KALENDER_IMAGE_HEIGHT / 2;
    // gleiche Stelle, aber in der 3. Wiederholung des Bildes
    clickAt(component, width, 100, 2 * imageHeightOnScreen + 50);
    expect(service.lights()).toEqual([{ x: 200, y: 100, kind: 'kette' }]);
  });

  it('can demonstrate the Christmas Eve scene (closes the editor first)', () => {
    const christmasEve = TestBed.inject(ChristmasEveService);
    const start = vi.spyOn(christmasEve, 'start').mockImplementation(() => {});
    service.toggleEditMode();

    TestBed.createComponent(TwinkleLightsEditorComponent).componentInstance.demoChristmasEve();

    expect(service.editMode()).toBe(false);
    expect(start).toHaveBeenCalledOnce();
  });

  it('shows the light count per kind', async () => {
    const fixture = TestBed.createComponent(TwinkleLightsEditorComponent);
    service.selectedKind.set('baum');
    service.toggleLightAt(10, 10);
    service.toggleLightAt(100, 10);
    await fixture.whenStable();
    expect(fixture.componentInstance.countByKind().baum).toBe(2);
  });
});
