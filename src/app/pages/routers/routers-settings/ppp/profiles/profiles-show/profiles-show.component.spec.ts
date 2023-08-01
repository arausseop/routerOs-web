import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesShowComponent } from './profiles-show.component';

describe('ProfilesShowComponent', () => {
  let component: ProfilesShowComponent;
  let fixture: ComponentFixture<ProfilesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilesShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
