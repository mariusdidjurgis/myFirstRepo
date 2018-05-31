import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaktikaComponent } from './galaktika.component';

describe('GalaktikaComponent', () => {
  let component: GalaktikaComponent;
  let fixture: ComponentFixture<GalaktikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalaktikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaktikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
