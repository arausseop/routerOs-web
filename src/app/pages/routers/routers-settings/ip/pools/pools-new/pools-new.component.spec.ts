import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolsNewComponent } from './pools-new.component';

describe('PoolsNewComponent', () => {
  let component: PoolsNewComponent;
  let fixture: ComponentFixture<PoolsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
