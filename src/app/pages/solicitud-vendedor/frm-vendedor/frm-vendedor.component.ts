import { Component, OnInit } from '@angular/core';

//Modelos
import { Cliente } from '../../../models/cliente.model';
import { Embarcar } from '../../../models/embarcar.model';
import { Vendedor } from '../../../models/vendedor.model';

@Component({
  selector: 'app-frm-vendedor',
  templateUrl: './frm-vendedor.component.html',
  styleUrls: ['./frm-vendedor.component.css']
})
export class FrmVendedorComponent implements OnInit {
  public cargando: boolean = false;
  public cliente: Cliente = new Cliente('', '');
  public embarcar: Embarcar = new Embarcar('', '');

  constructor() { }

  ngOnInit(): void {
  }

  obtenerCliente(cliente: Cliente) {
    this.cliente = cliente;
  }

  obtenerEmbarcar(embarcar: Embarcar) {
    this.embarcar = embarcar;
  }

  cargarVendedores = () : void => {

  }

}
