import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequelEventComponent } from './sequel-event.component';

describe('SequelEventComponent', () => {
  let component: SequelEventComponent;
  let fixture: ComponentFixture<SequelEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequelEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequelEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
