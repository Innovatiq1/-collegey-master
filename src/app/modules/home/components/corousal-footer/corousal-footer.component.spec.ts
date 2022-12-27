import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalFooterComponent } from './corousal-footer.component';

describe('CorousalTwoComponent', () => {
  let component: CorousalFooterComponent;
  let fixture: ComponentFixture<CorousalFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
