//Bibliotecas
import { Component, OnInit, ViewEncapsulation } from '@angular/core';


//Dependencias KENDO
import { RowArgs } from '@progress/kendo-angular-grid';
import { RowClassArgs } from '@progress/kendo-angular-grid';

//Modelos
import { OrdenVenta } from '../../models/ordenventa.model';

//Servicios
import { OrdenService } from '../../services/ordenVenta.service';

//Ambinete
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-preorder-list',
  templateUrl: './preorder-list.component.html',
  styleUrls: ['./preorder-list.component.css'],
  providers: [OrdenService],
  encapsulation: ViewEncapsulation.None
})
export class PreorderListComponent implements OnInit {

  public pendientes : any[] = new Array<any>();
  public noaprobados : any[] = new Array<any>();
  public cargando: boolean = false;
  public miSeleccion: any[] = [];
  //Codigo para seleccionar un elemento del grid por Folio
  public isRowSelected = (e: RowArgs) => this.miSeleccion.indexOf(e.dataItem.folio) >= 0;

  constructor(private _OrdenService: OrdenService, private router: Router) {
    //Constructor
   }

  ngOnInit() {
    this._OrdenService.obtenerordenesincompletas(0).subscribe(
      sucess => {
        if(sucess.ocode == 200){
          //Codigo cuando existen Ordenes incompletas
          if(sucess.PREORDENES.PREORDENESRow.length){
            this.pendientes = sucess.PREORDENES.PREORDENESRow;
          }
          else{
            this.pendientes.push(sucess.PREORDENES.PREORDENESRow);
          }

          //Rutina para convertir las Fechas de String a DATE y agregar status
          for(var i=0; i < this.pendientes.length; i++){
            this.pendientes[i].fecha = new Date(this.pendientes[i].fecha);
            if(this.pendientes[i].aprobada == 1){
              this.pendientes[i]['status'] = "Pendiente de Autorizacion";
            }
            if(this.pendientes[i].aprobada == 2){
              this.pendientes[i]['status'] = "Aprobada";
            }
            if(this.pendientes[i].aprobada > 2 || this.pendientes[i].aprobada < 1){
              this.pendientes[i]['status'] = "Pendiente de Finalizacion";
            }
          }

        }
        else{
          console.error("Registro no exitoso: " + sucess.odescripcion);
        }
      },
      error => {
        console.error(error);
      }
    );

    //ObtenerRegistros Rechazados.
    this._OrdenService.obtenernoaprobados().subscribe(
      response => {
        if(response.ocode == 200)
        {
          if(response.noaprobados.noaprobadosRow.length){
            this.noaprobados = response.noaprobados.noaprobadosRow;
          }
          else{
            this.noaprobados.push(response.noaprobados.noaprobadosRow);
          }
          for(var i=0; i < this.noaprobados.length; i++){
            this.noaprobados[i].fecha = new Date(this.noaprobados[i].fecha);
          }
        }
      },
      error => {
        console.error(error);
      }
    );

  }

  public seleccionarPreorden(dataItem){
    this.miSeleccion.pop();
    this.miSeleccion.push(dataItem);
    //Ejecutar codigo al seleccionar Orden
    this.router.navigate(['/preorder'], {state: {dataItem}});
  }

  public irNueva(){
    let dataItem = {};
    this.router.navigate(['/preorder'], {state: {dataItem}});
  }

  public rowCallback(context: RowClassArgs) {
    let warning = false;
    let danger = false;
    let normal = false;
    let ok = false;

    if(context.dataItem.status == "Pendiente de Finalizacion") {
      warning = true;
      danger = false;
      normal = false;  
      ok = false;
    }

    if(context.dataItem.status == "Aprobada") {
      warning = false;
      danger = false;
      normal = false; 
      ok = true; 
    }

    if(context.dataItem.status == "Pendiente de Autorizacion") {
      warning = false;
      danger = false;
      normal = true;  
      ok = false;
    }


    return {
        warning: warning,
        danger:  danger,
        normal: normal,
        ok : ok
    };
}

}
