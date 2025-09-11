import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosReporteComponent } from './usuarios-reporte.component';

describe('UsuariosReporteComponent', () => {
  let component: UsuariosReporteComponent;
  let fixture: ComponentFixture<UsuariosReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
