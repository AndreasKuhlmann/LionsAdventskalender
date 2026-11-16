import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';
import { Gewinn } from '../../services/gewinn.service';
import { KalenderComponent } from './kalender.component';

describe('KalenderComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    // jsdom kennt ResizeObserver nicht
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      }
    );

    await TestBed.configureTestingModule({
      imports: [KalenderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Storage,
          useValue: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should render one door per day', async () => {
    const fixture = TestBed.createComponent(KalenderComponent);
    fixture.detectChanges();

    const gewinne: Gewinn[] = [
      { Id: '1', Tag: 1, Losnummer: 11, Beschreibung: 'A' },
      { Id: '2', Tag: 1, Losnummer: 12, Beschreibung: 'B' },
      { Id: '3', Tag: 2, Losnummer: 21, Beschreibung: 'C' },
    ];
    http.expectOne(environment.url).flush(gewinne);

    // loadGewinne wartet nach dem HTTP-Aufruf noch auf den Storage; danach rendert das Signal
    await vi.waitFor(async () => {
      await fixture.whenStable();
      const doors = (fixture.nativeElement as HTMLElement).querySelectorAll('door');
      expect(doors.length).toBe(2);
    });
  });
});
