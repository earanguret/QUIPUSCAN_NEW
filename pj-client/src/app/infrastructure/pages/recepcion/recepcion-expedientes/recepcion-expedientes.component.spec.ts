import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionExpedientesComponent } from './recepcion-expedientes.component';

describe('RecepcionExpedientesComponent', () => {
  let component: RecepcionExpedientesComponent;
  let fixture: ComponentFixture<RecepcionExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionExpedientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
