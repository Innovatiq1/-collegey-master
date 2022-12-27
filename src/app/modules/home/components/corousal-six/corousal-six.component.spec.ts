import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorousalSixComponent } from './corousal-six.component';

describe('CorousalSixComponent', () => {
  let component: CorousalSixComponent;
  let fixture: ComponentFixture<CorousalSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorousalSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorousalSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
