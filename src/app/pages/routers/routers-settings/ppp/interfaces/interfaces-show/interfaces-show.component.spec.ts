import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesShowComponent } from './interfaces-show.component';

describe('InterfacesShowComponent', () => {
  let component: InterfacesShowComponent;
  let fixture: ComponentFixture<InterfacesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfacesShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
