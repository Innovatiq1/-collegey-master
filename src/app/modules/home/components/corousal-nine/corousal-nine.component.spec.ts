import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalNineComponent } from './corousal-nine.component';

describe('CorousalNineComponent', () => {
  let component: CorousalNineComponent;
  let fixture: ComponentFixture<CorousalNineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalNineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalNineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
