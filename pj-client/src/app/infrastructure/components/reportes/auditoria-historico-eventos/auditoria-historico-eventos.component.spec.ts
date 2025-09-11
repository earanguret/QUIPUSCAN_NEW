import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHistoricoEventosComponent } from './auditoria-historico-eventos.component';

describe('AuditoriaHistoricoEventosComponent', () => {
  let component: AuditoriaHistoricoEventosComponent;
  let fixture: ComponentFixture<AuditoriaHistoricoEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriaHistoricoEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaHistoricoEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
