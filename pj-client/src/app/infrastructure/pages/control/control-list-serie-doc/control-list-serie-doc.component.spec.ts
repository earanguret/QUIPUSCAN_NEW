import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlListSerieDocComponent } from './control-list-serie-doc.component';

describe('ControlListSerieDocComponent', () => {
  let component: ControlListSerieDocComponent;
  let fixture: ComponentFixture<ControlListSerieDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlListSerieDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlListSerieDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
