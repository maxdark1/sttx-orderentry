import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

//Modelos
import { Cliente } from '../../../models/cliente.model';
import { Embarcar } from '../../../models/embarcar.model';
import { Vendedor } from '../../../models/vendedor.model';

//Servicios
import { VendedorService } from '../../../services/vendedor.service';

@Component({
  selector: 'app-frm-vendedor',
  templateUrl: './frm-vendedor.component.html',
  styleUrls: ['./frm-vendedor.component.css'],
  providers: [VendedorService]
})
export class FrmVendedorComponent implements OnInit {
  public cargando: boolean = false;
  public cliente: Cliente = new Cliente('', '');
  public embarcar: Embarcar = new Embarcar('', '');
  public inside: Vendedor = new Vendedor('', '');
  public vendedor: Vendedor = new Vendedor('', '');
  public subdir: Vendedor = new Vendedor('', '');

  public inside_nuevo: Vendedor = new Vendedor('', '');
  public vendedor_nuevo: Vendedor = new Vendedor('', '');
  public subdir_nuevo: Vendedor = new Vendedor('', '');

  constructor(private _vendedor: VendedorService) { }

  ngOnInit(): void {
  }

  obtenerCliente(cliente: Cliente) {
    this.cliente = cliente;
    this.cargarVendedores();
    this.cargando = true;
  }

  obtenerEmbarcar(embarcar: Embarcar) {
    this.embarcar = embarcar;
    this.cargarVendedores();
    this.cargando = true;
  }

  cargarVendedores = (): void => {

    this._vendedor.obtenerVendedores(this.cliente, this.embarcar).subscribe({
      next: (response) => {
        if (response.oCode == 200) {
          let { ttVendedoresRow } = response.ttVendedores;
          //inside
          let inside = ttVendedoresRow.find(vendedor => vendedor['tt-tipo'] === 'inside');

          this.inside.codigo = inside['tt-codigo'];
          this.inside.nombre = inside['tt-vendedor'];
          //Vendedor
          let gerenteVentas = ttVendedoresRow.find(vendedor => vendedor['tt-tipo'] === 'vendedor');

          this.vendedor.codigo = gerenteVentas['tt-codigo'];
          this.vendedor.nombre = gerenteVentas['tt-vendedor'];
          //SubDir
          let subdir = ttVendedoresRow.find(vendedor => vendedor['tt-tipo'] === 'subdir');

          this.subdir.codigo = subdir['tt-codigo'];
          this.subdir.nombre = subdir['tt-vendedor'];
        }
      },
      error: (e) => {
        console.error("Ocurrio un error al Consumir el Web Service [wsgetsp] " + e);
        swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsgetsp]', 'error');
      }
    })
  }

  limpiar = () => {
    this.inside = new Vendedor('', '');
    this.vendedor = new Vendedor('', '');
    this.subdir = new Vendedor('', '');
    this.cliente = new Cliente('', '');
    this.embarcar = new Embarcar('', '');
    this.inside_nuevo = new Vendedor('', '');
    this.vendedor_nuevo = new Vendedor('', '');
    this.subdir_nuevo = new Vendedor('', '');
    this.cargando = false;
  }

  solicitarAutorizacion = () => {
    console.log(this.inside_nuevo, this.vendedor_nuevo, this.subdir_nuevo);
  }

  generarSolicitud = async () => {
    let validations = await this.validarInformacion();
    if(validations){
      //Guardar Solicitud
    }
  }

  validarInformacion = async (): Promise<boolean> => {
    let validations = false;
    //Validar Inside
    if (this.inside_nuevo.codigo === '') {
      validations = await this.confirmacionDatos("Inside Sales");
    } else validations = true;
    //Validar Vendedor
    if (validations != false) {
      if (this.vendedor_nuevo.codigo === '') {
        validations = await this.confirmacionDatos("Gerente de Ventas");
      } else validations = true;
    }
    //Validar Subdirector
    if (validations != false) {
      if (this.subdir_nuevo.codigo === '') {
        validations = await this.confirmacionDatos("Sub-Director de Ventas");
      } else validations = true;
    }
    return validations;
  }

  confirmacionDatos = async (texto: string): Promise<boolean> => {
    let validations: boolean;
    await swal.fire({
      title: `${texto} se a dejado sin asignar esta seguro que desea borrar el vendedor asignado al cliente?`,
      showDenyButton: true,
      confirmButtonText: "Si!",
      denyButtonText: `No!`,
    }).then((result) => {
      if (result.isConfirmed) {
        validations = true;
      } else {
        validations = false;
      }
    }).catch(() => { validations = false; });
    return validations;
  }

}