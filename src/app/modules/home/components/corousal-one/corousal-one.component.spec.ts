import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalOneComponent } from './corousal-one.component';

describe('CorousalOneComponent', () => {
  let component: CorousalOneComponent;
  let fixture: ComponentFixture<CorousalOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
