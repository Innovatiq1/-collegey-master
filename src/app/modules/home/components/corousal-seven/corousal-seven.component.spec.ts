import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalSevenComponent } from './corousal-seven.component';

describe('CorousalSevenComponent', () => {
  let component: CorousalSevenComponent;
  let fixture: ComponentFixture<CorousalSevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalSevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
