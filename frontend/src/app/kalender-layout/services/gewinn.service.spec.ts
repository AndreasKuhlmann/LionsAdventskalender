import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { environment } from '../../../environments/environment';
import { Gewinn, GewinnService } from './gewinn.service';

describe('GewinnService', () => {
  let service: GewinnService;
  let http: HttpTestingController;
  let storage: { get: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };

  const gewinne: Gewinn[] = [
    { Id: '1', Tag: 1, Losnummer: 11, Beschreibung: 'A' },
    { Id: '2', Tag: 1, Losnummer: 12, Beschreibung: 'B' },
    { Id: '3', Tag: 2, Losnummer: 21, Beschreibung: 'C' },
  ];

  beforeEach(() => {
    storage = { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Storage, useValue: storage }],
    });
    service = TestBed.inject(GewinnService);
    http = TestBed.inject(HttpTestingController);
  });

  async function load() {
    const done = service.loadGewinne();
    http.expectOne(environment.url).flush(gewinne);
    await done;
  }

  it('groups the prizes by day', async () => {
    await load();
    const tage = service.tagesGewinne();
    expect(tage.map((t) => t.Tag)).toEqual([1, 2]);
    expect(tage[0].Gewinne.length).toBe(2);
    expect(tage.every((t) => !t.flipped)).toBe(true);
  });

  it('restores opened doors from storage', async () => {
    storage.get.mockResolvedValue([{ Tag: 2, Gewinne: [], flipped: true }]);
    await load();
    expect(service.tagesGewinne().find((t) => t.Tag == 2)?.flipped).toBe(true);
    expect(service.tagesGewinne().find((t) => t.Tag == 1)?.flipped).toBe(false);
  });

  it('opens a door immutably and persists it', async () => {
    await load();
    const before = service.tagesGewinne();
    await service.flipDay(before[0]);

    const after = service.tagesGewinne();
    expect(after[0].flipped).toBe(true);
    expect(after).not.toBe(before);
    expect(before[0].flipped).toBe(false);
    expect(storage.set).toHaveBeenLastCalledWith('tagesGewinne', after);
  });
});
