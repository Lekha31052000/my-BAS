import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagHistoryComponent } from './red-flag-history.component';

describe('RedFlagHistoryComponent', () => {
  let component: RedFlagHistoryComponent;
  let fixture: ComponentFixture<RedFlagHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
