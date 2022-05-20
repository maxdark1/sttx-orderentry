import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

//Servicios
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-autorizacion-cambio',
  templateUrl: './autorizacion-cambio.component.html',
  styleUrls: ['./autorizacion-cambio.component.css'],
  providers: [VendedorService]
})
export class AutorizacionCambioComponent implements OnInit {

  public cargando: boolean = false;
  public pendientes : Array<any> = new Array<any>();

  constructor(private _vendedor : VendedorService) { }

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
        console.error("Ocurrio un error al Consumir el Web Service [wsgetspreq] " + e);
        swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsgetspreq]', 'error');
      }
    });
  }

  public holaLoca(dataItem) : void {
    console.log(dataItem);
  }
}
