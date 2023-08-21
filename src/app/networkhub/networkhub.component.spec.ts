import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkhubComponent } from './networkhub.component';

describe('NetworkhubComponent', () => {
  let component: NetworkhubComponent;
  let fixture: ComponentFixture<NetworkhubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkhubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
