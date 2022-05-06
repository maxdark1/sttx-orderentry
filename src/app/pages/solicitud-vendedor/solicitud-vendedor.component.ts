import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitud-vendedor',
  templateUrl: './solicitud-vendedor.component.html',
  styleUrls: ['./solicitud-vendedor.component.css']
})
export class SolicitudVendedorComponent implements OnInit {

  public cargando: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public consola = (mensaje: string) : void => {
    console.log(mensaje);
  }

}
