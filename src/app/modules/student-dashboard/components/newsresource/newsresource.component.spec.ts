import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsresourceComponent } from './newsresource.component';

describe('NewsresourceComponent', () => {
  let component: NewsresourceComponent;
  let fixture: ComponentFixture<NewsresourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsresourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
