import { TestBed } from '@angular/core/testing';

import { DigitalizacionService } from './digitalizacion.service';

describe('DigitalizacionService', () => {
  let service: DigitalizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
