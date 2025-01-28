import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDisplayComponent } from './filter-display.component';

describe('FilterDisplayComponent', () => {
  let component: FilterDisplayComponent;
  let fixture: ComponentFixture<FilterDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
