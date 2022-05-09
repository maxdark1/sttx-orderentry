import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVendedorComponent } from './frm-vendedor.component';

describe('FrmVendedorComponent', () => {
  let component: FrmVendedorComponent;
  let fixture: ComponentFixture<FrmVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrmVendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
