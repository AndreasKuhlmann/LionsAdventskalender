import { TestBed } from '@angular/core/testing';
import { KalenderComponent } from './kalender.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KalenderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(KalenderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'kalender'`, () => {
    const fixture = TestBed.createComponent(KalenderComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('kalender');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(KalenderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to kalender!'
    );
  });
});
