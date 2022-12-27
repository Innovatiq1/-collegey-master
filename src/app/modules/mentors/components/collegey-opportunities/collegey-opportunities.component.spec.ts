import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeyOpportunitiesComponent } from './collegey-opportunities.component';

describe('CollegeyOpportunitiesComponent', () => {
  let component: CollegeyOpportunitiesComponent;
  let fixture: ComponentFixture<CollegeyOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeyOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeyOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
