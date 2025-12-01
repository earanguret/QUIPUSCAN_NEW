import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovedaDiscosComponent } from './boveda-discos.component';

describe('BovedaDiscosComponent', () => {
  let component: BovedaDiscosComponent;
  let fixture: ComponentFixture<BovedaDiscosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovedaDiscosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BovedaDiscosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
