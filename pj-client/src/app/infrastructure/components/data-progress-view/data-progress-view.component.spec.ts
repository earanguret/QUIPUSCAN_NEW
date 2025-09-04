import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProgressViewComponent } from './data-progress-view.component';

describe('DataProgressViewComponent', () => {
  let component: DataProgressViewComponent;
  let fixture: ComponentFixture<DataProgressViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataProgressViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataProgressViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
