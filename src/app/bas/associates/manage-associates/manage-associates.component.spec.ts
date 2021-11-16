import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssociatesComponent } from './manage-associates.component';

describe('ManageAssociatesComponent', () => {
  let component: ManageAssociatesComponent;
  let fixture: ComponentFixture<ManageAssociatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAssociatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
