import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieDocumentalReporteComponent } from './serie-documental-reporte.component';

describe('SerieDocumentalReporteComponent', () => {
  let component: SerieDocumentalReporteComponent;
  let fixture: ComponentFixture<SerieDocumentalReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieDocumentalReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerieDocumentalReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
