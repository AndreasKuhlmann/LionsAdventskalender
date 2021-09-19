import { TestBed } from '@angular/core/testing';
import { AdventskalenderComponent } from './adventskalender.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdventskalenderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AdventskalenderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'adventskalender'`, () => {
    const fixture = TestBed.createComponent(AdventskalenderComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('adventskalender');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AdventskalenderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to adventskalender!'
    );
  });
});
