import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutersShowComponent } from './routers-show.component';

describe('RoutersShowComponent', () => {
  let component: RoutersShowComponent;
  let fixture: ComponentFixture<RoutersShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutersShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutersShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
