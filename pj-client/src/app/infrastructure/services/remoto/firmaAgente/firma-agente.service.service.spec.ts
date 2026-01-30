import { TestBed } from '@angular/core/testing';

import { FirmaAgenteServiceService } from './firma-agente.service.service';

describe('FirmaAgenteServiceService', () => {
  let service: FirmaAgenteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirmaAgenteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
