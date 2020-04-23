import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaParteComponent } from './busqueda-parte.component';

describe('BusquedaParteComponent', () => {
  let component: BusquedaParteComponent;
  let fixture: ComponentFixture<BusquedaParteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaParteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaParteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
