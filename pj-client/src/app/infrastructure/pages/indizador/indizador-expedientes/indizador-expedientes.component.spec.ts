import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndizadorExpedientesComponent } from './indizador-expedientes.component';

describe('IndizadorExpedientesComponent', () => {
  let component: IndizadorExpedientesComponent;
  let fixture: ComponentFixture<IndizadorExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndizadorExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndizadorExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
