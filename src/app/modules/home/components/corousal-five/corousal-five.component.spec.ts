import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalFiveComponent } from './corousal-five.component';

describe('CorousalFiveComponent', () => {
  let component: CorousalFiveComponent;
  let fixture: ComponentFixture<CorousalFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
