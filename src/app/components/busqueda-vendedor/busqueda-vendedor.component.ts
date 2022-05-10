import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda-vendedor',
  templateUrl: './busqueda-vendedor.component.html',
  styleUrls: ['./busqueda-vendedor.component.css']
})
export class BusquedaVendedorComponent implements OnInit {

  vendedorSeleccionado: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
