import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FedatarioListSerieDocComponent } from './fedatario-list-serie-doc.component';

describe('FedatarioListSerieDocComponent', () => {
  let component: FedatarioListSerieDocComponent;
  let fixture: ComponentFixture<FedatarioListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FedatarioListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FedatarioListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
