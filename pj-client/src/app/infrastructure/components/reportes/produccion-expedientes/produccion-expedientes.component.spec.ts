import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionExpedientesComponent } from './produccion-expedientes.component';

describe('ProduccionExpedientesComponent', () => {
  let component: ProduccionExpedientesComponent;
  let fixture: ComponentFixture<ProduccionExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
