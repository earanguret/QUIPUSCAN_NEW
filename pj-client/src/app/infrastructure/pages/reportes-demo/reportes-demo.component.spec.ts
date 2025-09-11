import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDemoComponent } from './reportes-demo.component';

describe('ReportesDemoComponent', () => {
  let component: ReportesDemoComponent;
  let fixture: ComponentFixture<ReportesDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
