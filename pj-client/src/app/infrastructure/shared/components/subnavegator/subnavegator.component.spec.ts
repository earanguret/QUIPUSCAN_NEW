import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnavegatorComponent } from './subnavegator.component';

describe('SubnavegatorComponent', () => {
  let component: SubnavegatorComponent;
  let fixture: ComponentFixture<SubnavegatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubnavegatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubnavegatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
