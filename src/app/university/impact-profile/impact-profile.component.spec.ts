import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactProfileComponent } from './impact-profile.component';

describe('ImpactProfileComponent', () => {
  let component: ImpactProfileComponent;
  let fixture: ComponentFixture<ImpactProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
