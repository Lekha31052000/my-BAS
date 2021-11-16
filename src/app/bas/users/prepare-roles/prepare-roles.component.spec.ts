import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareRolesComponent } from './prepare-roles.component';

describe('PrepareRolesComponent', () => {
  let component: PrepareRolesComponent;
  let fixture: ComponentFixture<PrepareRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
