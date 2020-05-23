import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacemeshPage } from './facemesh.page';

describe('FacemeshPage', () => {
  let component: FacemeshPage;
  let fixture: ComponentFixture<FacemeshPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacemeshPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacemeshPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
