import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesNewComponent } from './interfaces-new.component';

describe('InterfacesNewComponent', () => {
  let component: InterfacesNewComponent;
  let fixture: ComponentFixture<InterfacesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfacesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
