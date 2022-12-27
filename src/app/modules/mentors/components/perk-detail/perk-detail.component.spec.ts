import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkDetailComponent } from './perk-detail.component';

describe('PerkDetailComponent', () => {
  let component: PerkDetailComponent;
  let fixture: ComponentFixture<PerkDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerkDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
