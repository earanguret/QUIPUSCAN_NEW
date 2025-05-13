import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparacionListSerieDocComponent } from './preparacion-list-serie-doc.component';

describe('PreparacionListSerieDocComponent', () => {
  let component: PreparacionListSerieDocComponent;
  let fixture: ComponentFixture<PreparacionListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparacionListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparacionListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
