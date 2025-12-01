import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovedaDiscoDetalleComponent } from './boveda-disco-detalle.component';

describe('BovedaDiscoDetalleComponent', () => {
  let component: BovedaDiscoDetalleComponent;
  let fixture: ComponentFixture<BovedaDiscoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovedaDiscoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BovedaDiscoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
