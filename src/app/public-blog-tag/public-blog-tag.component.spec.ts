import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBlogTagComponent } from './public-blog-tag.component';

describe('PublicBlogTagComponent', () => {
  let component: PublicBlogTagComponent;
  let fixture: ComponentFixture<PublicBlogTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBlogTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBlogTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
