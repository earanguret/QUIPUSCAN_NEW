import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionUsuarioReporteComponent } from './produccion-usuario-reporte.component';

describe('ProduccionUsuarioReporteComponent', () => {
  let component: ProduccionUsuarioReporteComponent;
  let fixture: ComponentFixture<ProduccionUsuarioReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionUsuarioReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionUsuarioReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
