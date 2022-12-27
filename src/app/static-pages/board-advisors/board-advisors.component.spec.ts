import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAdvisorsComponent } from './board-advisors.component';

describe('BoardAdvisorsComponent', () => {
  let component: BoardAdvisorsComponent;
  let fixture: ComponentFixture<BoardAdvisorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardAdvisorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardAdvisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
