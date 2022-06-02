import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

//Servicios
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-solicitud-vendedor',
  templateUrl: './solicitud-vendedor.component.html',
  styleUrls: ['./solicitud-vendedor.component.css'],
  providers: [VendedorService]
})
export class SolicitudVendedorComponent implements OnInit {

  public cargando: boolean = false;
  public pendientes : Array<any> = new Array<any>();

  constructor(private router: Router, private _vendedor : VendedorService) { }

  ngOnInit(): void {
    this._vendedor.obtenerListaPendientes(0,0).subscribe({
      next : (response) => {
        if(response.oCode == 200){
          //Codigo cuando existen Ordenes incompletas
          if(response.ttSalesreq.ttSalesreqRow.length){
            this.pendientes = response.ttSalesreq.ttSalesreqRow;
          }
          else{
            this.pendientes.push(response.ttSalesreq.ttSalesreqRow);
          }
        }
      },
      error: (e) => {
        console.error("Ocurrio un error al Consumir el Web Service [wsgetspreq] " + e.message);
        swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsgetspreq]', 'error');
      }
    });
  }

  public nuevoSolicitud = () : void => {
    let dataItem = {};
    this.router.navigate(['/frm-vendedor'], {state: {dataItem}});
  }

}
