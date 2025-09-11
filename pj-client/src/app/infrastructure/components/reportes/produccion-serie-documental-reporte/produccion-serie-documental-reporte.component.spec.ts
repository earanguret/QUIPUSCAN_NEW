import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionSerieDocumentalReporteComponent } from './produccion-serie-documental-reporte.component';

describe('ProduccionSerieDocumentalReporteComponent', () => {
  let component: ProduccionSerieDocumentalReporteComponent;
  let fixture: ComponentFixture<ProduccionSerieDocumentalReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionSerieDocumentalReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionSerieDocumentalReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
