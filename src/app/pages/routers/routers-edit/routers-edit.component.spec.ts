import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutersEditComponent } from './routers-edit.component';

describe('RoutersEditComponent', () => {
  let component: RoutersEditComponent;
  let fixture: ComponentFixture<RoutersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutersEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
