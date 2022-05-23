import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVendedorComponent } from './frm-vendedor.component';

import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule, HttpClient } from '@angular/common/http'; 

import { UserService } from '../../../services/user.service';



describe('FrmVendedorComponent', () => {
  let component: FrmVendedorComponent;
  let fixture: ComponentFixture<FrmVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ FrmVendedorComponent ],
      providers: [HttpClient, UserService]
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
