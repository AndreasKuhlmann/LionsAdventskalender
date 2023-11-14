import { TestBed } from '@angular/core/testing';
import { KalenderLayoutComponent } from './kalender-layout.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KalenderLayoutComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(KalenderLayoutComponent);
    const app = fixture.componentInstance;
  });

  it(`should have as title 'kalender'`, () => {
    const fixture = TestBed.createComponent(KalenderLayoutComponent);
    const app = fixture.componentInstance;
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(KalenderLayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to kalender!'
    );
  });
});
