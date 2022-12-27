import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalFourComponent } from './corousal-four.component';

describe('CorousalFourComponent', () => {
  let component: CorousalFourComponent;
  let fixture: ComponentFixture<CorousalFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
