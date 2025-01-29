import { TestBed } from '@angular/core/testing';

import { BuildDbService } from './build-db.service';

describe('BuildDbService', () => {
  let service: BuildDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
