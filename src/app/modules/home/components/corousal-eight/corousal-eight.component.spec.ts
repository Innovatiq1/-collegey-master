import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalEightComponent } from './corousal-eight.component';

describe('CorousalEightComponent', () => {
  let component: CorousalEightComponent;
  let fixture: ComponentFixture<CorousalEightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalEightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalEightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
