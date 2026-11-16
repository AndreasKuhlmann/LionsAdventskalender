import { TestBed } from '@angular/core/testing';
import { ChristmasEveService } from '../../services/christmas-eve.service';
import { ChristmasEveComponent } from './christmas-eve.component';
import { CHRISTMAS_EVE_TEXTS } from './christmas-eve.texts';

describe('ChristmasEveComponent', () => {
  let christmasEve: { end: ReturnType<typeof vi.fn> };
  const originalSumme = CHRISTMAS_EVE_TEXTS.spendensumme;

  beforeEach(() => {
    christmasEve = { end: vi.fn() };
    TestBed.configureTestingModule({
      imports: [ChristmasEveComponent],
      providers: [{ provide: ChristmasEveService, useValue: christmasEve }],
    });
  });

  afterEach(() => (CHRISTMAS_EVE_TEXTS.spendensumme = originalSumme));

  it('shows the star and the Christmas greeting', async () => {
    const fixture = TestBed.createComponent(ChristmasEveComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('svg.star')).not.toBeNull();
    expect(el.textContent).toContain('Frohe Weihnachten!');
    expect(el.textContent).toContain(CHRISTMAS_EVE_TEXTS.signature);
    expect(el.querySelector('.summe')).toBeNull(); // keine Summe eingetragen
  });

  it('shows the donation total when configured', async () => {
    CHRISTMAS_EVE_TEXTS.spendensumme = '35.000 €';
    const fixture = TestBed.createComponent(ChristmasEveComponent);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.summe')?.textContent).toContain('35.000 €');
  });

  it('ends the scene via the button or the Escape key', async () => {
    const fixture = TestBed.createComponent(ChristmasEveComponent);
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    expect(christmasEve.end).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(christmasEve.end).toHaveBeenCalledTimes(2);
  });
});
