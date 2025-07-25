import { TestBed } from '@angular/core/testing';

import { FedatarioService } from './fedatario.service';

describe('FedatarioService', () => {
  let service: FedatarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FedatarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
