import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalizacionListSerieDocComponent } from './digitalizacion-list-serie-doc.component';

describe('DigitalizacionListSerieDocComponent', () => {
  let component: DigitalizacionListSerieDocComponent;
  let fixture: ComponentFixture<DigitalizacionListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizacionListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalizacionListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
