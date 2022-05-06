import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudVendedorComponent } from './solicitud-vendedor.component';

describe('SolicitudVendedorComponent', () => {
  let component: SolicitudVendedorComponent;
  let fixture: ComponentFixture<SolicitudVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudVendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
