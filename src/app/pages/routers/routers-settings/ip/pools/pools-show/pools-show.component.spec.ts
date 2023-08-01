import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolsShowComponent } from './pools-show.component';

describe('PoolsShowComponent', () => {
  let component: PoolsShowComponent;
  let fixture: ComponentFixture<PoolsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolsShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
