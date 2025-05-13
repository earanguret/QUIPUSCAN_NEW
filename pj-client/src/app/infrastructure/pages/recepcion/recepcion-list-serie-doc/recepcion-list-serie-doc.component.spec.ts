import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionListSerieDocComponent } from './recepcion-list-serie-doc.component';

describe('RecepcionListSerieDocComponent', () => {
  let component: RecepcionListSerieDocComponent;
  let fixture: ComponentFixture<RecepcionListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
