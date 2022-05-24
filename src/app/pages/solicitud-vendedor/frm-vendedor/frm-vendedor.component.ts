import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

//Modelos
import { Cliente } from '../../../models/cliente.model';
import { Embarcar } from '../../../models/embarcar.model';
import { Vendedor } from '../../../models/vendedor.model';

//Servicios
import { VendedorService } from '../../../services/vendedor.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-frm-vendedor',
  templateUrl: './frm-vendedor.component.html',
  styleUrls: ['./frm-vendedor.component.css'],
  providers: [VendedorService, NotificacionService]
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

  constructor(private _vendedor: VendedorService, private router: Router, private _notificacion: NotificacionService) { }

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
      this._vendedor.guardarSolicitud(0,this.inside_nuevo,this.vendedor_nuevo,this.subdir_nuevo,this.cliente,this.embarcar).subscribe(
        {
          next: async (response) => {
            if(response.oCode == 200){
              swal.fire('OK!', 'Datos Guardados con Exito', 'success');
              this.limpiar();
            }

            //Lanzar Notificacion por correo
            let correos = await firstValueFrom(this._notificacion.obtenerCorreos('11','VTA_NOT','VTA_NOT'));
            let json = JSON.parse(correos.correos).root.users as Array<any>;
            let mails = json.map(x => x.Correo+",").join().slice(0, -1);
            
            await firstValueFrom(this._notificacion.enviarCorreo(mails,correos.titulo,correos.cuerpo,correos.pie));
          },
          error: (e) => {
            console.error("Ocurrio un error al Consumir el Web Service [wssetspreq] " + e);
            swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wssetspreq]', 'error');
          }
        }
      );
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

  irLista() {
    this.router.navigate(['/solicitud-cambio']);
  }

}