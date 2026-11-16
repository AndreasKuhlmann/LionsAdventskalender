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
