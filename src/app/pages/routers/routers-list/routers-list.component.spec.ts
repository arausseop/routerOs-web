import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutersListComponent } from './routers-list.component';

describe('RoutersListComponent', () => {
  let component: RoutersListComponent;
  let fixture: ComponentFixture<RoutersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
