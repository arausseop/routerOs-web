import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutersTabsComponent } from './routers-tabs.component';

describe('RoutersTabsComponent', () => {
  let component: RoutersTabsComponent;
  let fixture: ComponentFixture<RoutersTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutersTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutersTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
