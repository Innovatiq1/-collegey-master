import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeyFundComponent } from './collegey-fund.component';

describe('CollegeyFundComponent', () => {
  let component: CollegeyFundComponent;
  let fixture: ComponentFixture<CollegeyFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeyFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeyFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
