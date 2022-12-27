import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageyComponent } from './collagey.component';

describe('CollageyComponent', () => {
  let component: CollageyComponent;
  let fixture: ComponentFixture<CollageyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollageyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollageyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
