import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalTwoComponent } from './corousal-two.component';

describe('CorousalTwoComponent', () => {
  let component: CorousalTwoComponent;
  let fixture: ComponentFixture<CorousalTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
