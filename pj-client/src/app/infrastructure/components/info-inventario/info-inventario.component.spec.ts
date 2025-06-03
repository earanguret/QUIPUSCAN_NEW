import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInventarioComponent } from './info-inventario.component';

describe('InfoInventarioComponent', () => {
  let component: InfoInventarioComponent;
  let fixture: ComponentFixture<InfoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
