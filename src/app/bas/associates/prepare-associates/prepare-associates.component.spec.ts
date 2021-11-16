import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAssociatesComponent } from './prepare-associates.component';

describe('PrepareAssociatesComponent', () => {
  let component: PrepareAssociatesComponent;
  let fixture: ComponentFixture<PrepareAssociatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareAssociatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
