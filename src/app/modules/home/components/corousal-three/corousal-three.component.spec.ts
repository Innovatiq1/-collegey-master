import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalThreeComponent } from './corousal-three.component';

describe('CorousalThreeComponent', () => {
  let component: CorousalThreeComponent;
  let fixture: ComponentFixture<CorousalThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
