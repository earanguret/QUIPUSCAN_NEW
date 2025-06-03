import { TestBed } from '@angular/core/testing';

import { PreparacionService } from './preparacion.service';

describe('PreparacionService', () => {
  let service: PreparacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreparacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
