import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KalenderLayoutComponent } from './kalender-layout.component';

describe('KalenderLayoutComponent', () => {
  beforeEach(async () => {
    // jsdom kennt matchMedia nicht (wird von der Toolbar für die PWA-Erkennung genutzt)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));

    await TestBed.configureTestingModule({
      imports: [KalenderLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should render toolbar and router outlet', async () => {
    const fixture = TestBed.createComponent(KalenderLayoutComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-toolbar')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
