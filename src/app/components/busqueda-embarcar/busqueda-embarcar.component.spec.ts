import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaEmbarcarComponent } from './busqueda-embarcar.component';

describe('BusquedaEmbarcarComponent', () => {
  let component: BusquedaEmbarcarComponent;
  let fixture: ComponentFixture<BusquedaEmbarcarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaEmbarcarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaEmbarcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
