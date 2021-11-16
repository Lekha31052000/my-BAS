import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingManagerDialogComponent } from './reporting-manager-dialog.component';

describe('ReportingManagerDialogComponent', () => {
  let component: ReportingManagerDialogComponent;
  let fixture: ComponentFixture<ReportingManagerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingManagerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
