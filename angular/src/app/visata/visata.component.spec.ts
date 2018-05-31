import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisataComponent } from './visata.component';

describe('VisataComponent', () => {
  let component: VisataComponent;
  let fixture: ComponentFixture<VisataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
