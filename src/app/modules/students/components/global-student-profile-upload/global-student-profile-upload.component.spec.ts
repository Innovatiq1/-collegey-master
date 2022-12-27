import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStudentProfileUploadComponent } from './global-student-profile-upload.component';

describe('GlobalStudentProfileUploadComponent', () => {
  let component: GlobalStudentProfileUploadComponent;
  let fixture: ComponentFixture<GlobalStudentProfileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalStudentProfileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalStudentProfileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
