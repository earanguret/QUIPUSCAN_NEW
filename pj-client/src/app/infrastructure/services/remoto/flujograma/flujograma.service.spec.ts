import { TestBed } from '@angular/core/testing';

import { FlujogramaService } from './flujograma.service';

describe('FlujogramaService', () => {
  let service: FlujogramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlujogramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
