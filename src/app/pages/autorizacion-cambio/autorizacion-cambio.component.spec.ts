import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionCambioComponent } from './autorizacion-cambio.component';

describe('AutorizacionCambioComponent', () => {
  let component: AutorizacionCambioComponent;
  let fixture: ComponentFixture<AutorizacionCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
