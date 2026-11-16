import { TestBed } from '@angular/core/testing';
import { FLAKE_COUNT, SnowfallComponent } from './snowfall.component';

describe('SnowfallComponent', () => {
  it('renders many randomly placed snowflakes', async () => {
    const fixture = TestBed.createComponent(SnowfallComponent);
    await fixture.whenStable();

    const flakes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.flake');
    expect(flakes.length).toBe(FLAKE_COUNT);

    const positions = new Set([...flakes].map((f) => f.style.left));
    expect(positions.size).toBeGreaterThan(30); // zufällig verteilt, nicht alle an derselben Stelle
  });

  it('starts the snowfall already in progress (negative delays)', async () => {
    const fixture = TestBed.createComponent(SnowfallComponent);
    await fixture.whenStable();

    for (const flake of fixture.componentInstance.flakes) {
      expect(flake.fallDelay).toBeLessThanOrEqual(0);
      expect(flake.fallDelay).toBeGreaterThanOrEqual(-flake.fallDuration);
    }
  });
});

describe('SnowfallComponent on Christmas Eve', () => {
  it('snows more heavily while the Christmas Eve scene is running', async () => {
    const { ChristmasEveService } = await import('../../services/christmas-eve.service');
    const { signal } = await import('@angular/core');
    const { EXTRA_FLAKES_CHRISTMAS_EVE } = await import('./snowfall.component');
    const active = signal(false);
    TestBed.configureTestingModule({ providers: [{ provide: ChristmasEveService, useValue: { active } }] });

    const fixture = TestBed.createComponent(SnowfallComponent);
    await fixture.whenStable();
    const count = () => (fixture.nativeElement as HTMLElement).querySelectorAll('.flake').length;
    expect(count()).toBe(FLAKE_COUNT);

    active.set(true);
    await fixture.whenStable();
    expect(count()).toBe(FLAKE_COUNT + EXTRA_FLAKES_CHRISTMAS_EVE);
  });
});
