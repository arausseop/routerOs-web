import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutersNewComponent } from './routers-new.component';

describe('RoutersNewComponent', () => {
  let component: RoutersNewComponent;
  let fixture: ComponentFixture<RoutersNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutersNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
