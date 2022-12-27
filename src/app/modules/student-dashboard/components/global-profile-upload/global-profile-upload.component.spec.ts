import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalProfileUploadComponent } from './global-profile-upload.component';

describe('GlobalProfileUploadComponent', () => {
  let component: GlobalProfileUploadComponent;
  let fixture: ComponentFixture<GlobalProfileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalProfileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalProfileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
