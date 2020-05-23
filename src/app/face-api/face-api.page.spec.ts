import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceApiPage } from './face-api.page';

describe('FaceApiPage', () => {
  let component: FaceApiPage;
  let fixture: ComponentFixture<FaceApiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceApiPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
