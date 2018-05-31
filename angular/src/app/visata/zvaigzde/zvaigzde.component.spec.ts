import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZvaigzdeComponent } from './zvaigzde.component';

describe('ZvaigzdeComponent', () => {
  let component: ZvaigzdeComponent;
  let fixture: ComponentFixture<ZvaigzdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZvaigzdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZvaigzdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
