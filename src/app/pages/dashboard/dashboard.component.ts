import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AccesoService]
})
export class DashboardComponent implements OnInit {
 
  public accesos: any[] = [];

  constructor(private _accesoService : AccesoService, private router: Router) {
    
   }
  
  ngOnInit() {
    //Revisa si el usuario tiene permisos para entrar al componente
    this._accesoService.permiso();
  }
}
