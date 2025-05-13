import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndizadorListSerieDocComponent } from './indizador-list-serie-doc.component';

describe('IndizadorListSerieDocComponent', () => {
  let component: IndizadorListSerieDocComponent;
  let fixture: ComponentFixture<IndizadorListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndizadorListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndizadorListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
