import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessFreeProjectComponent } from './success-free-project.component';

describe('SuccessFreeProjectComponent', () => {
  let component: SuccessFreeProjectComponent;
  let fixture: ComponentFixture<SuccessFreeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessFreeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessFreeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
