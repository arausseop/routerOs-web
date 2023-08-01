import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesListComponent } from './interfaces-list.component';

describe('InterfacesListComponent', () => {
  let component: InterfacesListComponent;
  let fixture: ComponentFixture<InterfacesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfacesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
