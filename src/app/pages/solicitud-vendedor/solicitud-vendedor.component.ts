import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-vendedor',
  templateUrl: './solicitud-vendedor.component.html',
  styleUrls: ['./solicitud-vendedor.component.css']
})
export class SolicitudVendedorComponent implements OnInit {

  public cargando: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

 

  public nuevoSolicitud = () : void => {
    let dataItem = {};
    this.router.navigate(['/frm-vendedor'], {state: {dataItem}});
  }

}
