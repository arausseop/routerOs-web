import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretsNewComponent } from './secrets-new.component';

describe('SecretsNewComponent', () => {
  let component: SecretsNewComponent;
  let fixture: ComponentFixture<SecretsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
