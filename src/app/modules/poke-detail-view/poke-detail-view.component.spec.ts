import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeDetailViewComponent } from './poke-detail-view.component';

describe('PokeDetailViewComponent', () => {
  let component: PokeDetailViewComponent;
  let fixture: ComponentFixture<PokeDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
