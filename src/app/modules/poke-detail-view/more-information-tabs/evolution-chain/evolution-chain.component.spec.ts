import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionChainComponent } from './evolution-chain.component';

describe('EvolutionChainComponent', () => {
  let component: EvolutionChainComponent;
  let fixture: ComponentFixture<EvolutionChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionChainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
