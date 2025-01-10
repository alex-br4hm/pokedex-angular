import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariousInformationComponent } from './various-information.component';

describe('VariousInformationComponent', () => {
  let component: VariousInformationComponent;
  let fixture: ComponentFixture<VariousInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariousInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariousInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
