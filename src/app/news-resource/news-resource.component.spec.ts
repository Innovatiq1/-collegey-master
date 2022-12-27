import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsResourceComponent } from './news-resource.component';

describe('NewsResourceComponent', () => {
  let component: NewsResourceComponent;
  let fixture: ComponentFixture<NewsResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
