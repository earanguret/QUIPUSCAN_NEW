import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovedaListSerieDocComponent } from './boveda-list-serie-doc.component';

describe('BovedaListSerieDocComponent', () => {
  let component: BovedaListSerieDocComponent;
  let fixture: ComponentFixture<BovedaListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovedaListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BovedaListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
