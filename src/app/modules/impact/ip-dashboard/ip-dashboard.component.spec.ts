import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpDashboardComponent } from './ip-dashboard.component';

describe('IpDashboardComponent', () => {
  let component: IpDashboardComponent;
  let fixture: ComponentFixture<IpDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
