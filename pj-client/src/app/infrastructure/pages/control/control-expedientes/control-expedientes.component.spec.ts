import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlExpedientesComponent } from './control-expedientes.component';

describe('ControlExpedientesComponent', () => {
  let component: ControlExpedientesComponent;
  let fixture: ComponentFixture<ControlExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
