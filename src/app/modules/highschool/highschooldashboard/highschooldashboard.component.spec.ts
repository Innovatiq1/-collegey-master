import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighschooldashboardComponent } from './highschooldashboard.component';

describe('HighschooldashboardComponent', () => {
  let component: HighschooldashboardComponent;
  let fixture: ComponentFixture<HighschooldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighschooldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighschooldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
