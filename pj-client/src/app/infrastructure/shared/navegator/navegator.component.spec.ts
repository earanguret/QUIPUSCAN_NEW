import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegatorComponent } from './navegator.component';

describe('NavegatorComponent', () => {
  let component: NavegatorComponent;
  let fixture: ComponentFixture<NavegatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
