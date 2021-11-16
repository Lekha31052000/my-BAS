import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFilterDialogComponent } from './download-filter-dialog.component';

describe('DownloadFilterDialogComponent', () => {
  let component: DownloadFilterDialogComponent;
  let fixture: ComponentFixture<DownloadFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
