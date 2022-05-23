import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudVendedorComponent } from './solicitud-vendedor.component';

import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http'; 

import { UserService } from '../../services/user.service';

describe('SolicitudVendedorComponent', () => {
  let component: SolicitudVendedorComponent;
  let fixture: ComponentFixture<SolicitudVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ SolicitudVendedorComponent ],
      providers: [HttpClient, UserService, HttpHandler]
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
