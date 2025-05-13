import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalizacionExpedientesComponent } from './digitalizacion-expedientes.component';

describe('DigitalizacionExpedientesComponent', () => {
  let component: DigitalizacionExpedientesComponent;
  let fixture: ComponentFixture<DigitalizacionExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizacionExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalizacionExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
