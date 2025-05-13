import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FedatarioExpedientesComponent } from './fedatario-expedientes.component';

describe('FedatarioExpedientesComponent', () => {
  let component: FedatarioExpedientesComponent;
  let fixture: ComponentFixture<FedatarioExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FedatarioExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FedatarioExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
