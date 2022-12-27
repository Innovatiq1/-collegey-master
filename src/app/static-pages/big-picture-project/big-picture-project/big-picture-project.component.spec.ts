import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPictureProjectComponent } from './big-picture-project.component';

describe('BigPictureProjectComponent', () => {
  let component: BigPictureProjectComponent;
  let fixture: ComponentFixture<BigPictureProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigPictureProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigPictureProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
