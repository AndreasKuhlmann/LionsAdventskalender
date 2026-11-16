import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { KalenderLayoutComponent } from './kalender-layout.component';

describe('KalenderLayoutComponent', () => {
  beforeEach(async () => {
    // jsdom kennt matchMedia nicht (wird von der Toolbar für die PWA-Erkennung genutzt)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));

    await TestBed.configureTestingModule({
      imports: [KalenderLayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Storage, useValue: { get: vi.fn().mockResolvedValue(null), set: vi.fn() } },
      ],
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
