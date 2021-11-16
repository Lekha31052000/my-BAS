import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVendorUserAssociatesComponent } from './manage-vendor-user-associates.component';

describe('ManageVendorUserAssociatesComponent', () => {
  let component: ManageVendorUserAssociatesComponent;
  let fixture: ComponentFixture<ManageVendorUserAssociatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVendorUserAssociatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVendorUserAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
