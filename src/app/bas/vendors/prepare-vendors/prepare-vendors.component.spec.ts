import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareVendorsComponent } from './prepare-vendors.component';

describe('PrepareVendorsComponent', () => {
  let component: PrepareVendorsComponent;
  let fixture: ComponentFixture<PrepareVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
