import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovedaExpedientesComponent } from './boveda-expedientes.component';

describe('BovedaExpedientesComponent', () => {
  let component: BovedaExpedientesComponent;
  let fixture: ComponentFixture<BovedaExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovedaExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BovedaExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
