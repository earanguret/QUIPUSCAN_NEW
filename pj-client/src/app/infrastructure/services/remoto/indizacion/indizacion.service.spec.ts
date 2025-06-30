import { TestBed } from '@angular/core/testing';

import { IndizacionService } from './indizacion.service';

describe('IndizacionService', () => {
  let service: IndizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
