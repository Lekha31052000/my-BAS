import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareUsersComponent } from './prepare-users.component';

describe('PrepareUsersComponent', () => {
  let component: PrepareUsersComponent;
  let fixture: ComponentFixture<PrepareUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
