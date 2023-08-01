import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretsShowComponent } from './secrets-show.component';

describe('SecretsShowComponent', () => {
  let component: SecretsShowComponent;
  let fixture: ComponentFixture<SecretsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretsShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
