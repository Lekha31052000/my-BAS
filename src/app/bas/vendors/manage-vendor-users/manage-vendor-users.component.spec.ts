import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVendorUsersComponent } from './manage-vendor-users.component';

describe('ManageVendorUsersComponent', () => {
  let component: ManageVendorUsersComponent;
  let fixture: ComponentFixture<ManageVendorUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVendorUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVendorUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
