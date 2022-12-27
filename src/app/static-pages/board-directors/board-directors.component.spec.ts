import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDirectorsComponent } from './board-directors.component';

describe('BoardDirectorsComponent', () => {
  let component: BoardDirectorsComponent;
  let fixture: ComponentFixture<BoardDirectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDirectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDirectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
