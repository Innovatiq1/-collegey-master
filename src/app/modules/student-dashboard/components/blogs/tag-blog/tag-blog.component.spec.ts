import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBlogComponent } from './tag-blog.component';

describe('TagBlogComponent', () => {
  let component: TagBlogComponent;
  let fixture: ComponentFixture<TagBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
