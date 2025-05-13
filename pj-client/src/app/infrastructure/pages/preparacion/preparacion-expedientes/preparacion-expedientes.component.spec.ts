import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparacionExpedientesComponent } from './preparacion-expedientes.component';

describe('PreparacionExpedientesComponent', () => {
  let component: PreparacionExpedientesComponent;
  let fixture: ComponentFixture<PreparacionExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparacionExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparacionExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
