import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalTenComponent } from './corousal-ten.component';

describe('CorousalTenComponent', () => {
  let component: CorousalTenComponent;
  let fixture: ComponentFixture<CorousalTenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalTenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
