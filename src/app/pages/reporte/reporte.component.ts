import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

//Servicios
import { OrdenService } from '../../services/ordenVenta.service';

//Bibliotecas
import * as moment from 'moment';

//Dependencias KENDO
import { RowArgs } from '@progress/kendo-angular-grid';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [OrdenService],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteComponent implements OnInit {

  public orden: string = "";
  public site: string = "";
  public region: string = "";
  public vendido: string = "";
  public vendedor: string = "";
  public inside : string = "";
  public embarcar : string = "";
  public fecha1: Date = new Date(Date.now.toString());
  public fecha2: Date = new Date(Date.now.toString());
  public cargando: boolean = false;
  public datos: any = new Array<any>();
  public expandedDetailKeys: any[] = [];
  public rol: number = 0;
  public almacenes : Array<any> = new Array<any>();
  public clientes : Array<any> = new Array<any>();
  public embarcars : Array<any> = new Array<any>();
  public dropdownalmacenesfilter : Array<any> = new Array<any>();
  public dropdownclientesfilter: Array<any> = new Array<any>();
  public dropdownembarcasfilter: Array<any> = new Array<any>();
  public limitado = false;
 

  constructor(private _ordenService: OrdenService) {
    this.dropdownalmacenesfilter = this.almacenes.slice();
    this.dropdownclientesfilter = this.clientes.slice();
    this.dropdownembarcasfilter = this.embarcars.slice();
   }

   filtroalmacenes(value) {
    this.dropdownalmacenesfilter = this.almacenes.filter((s) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    if(this.dropdownalmacenesfilter.length == 0)
    {
      this.dropdownalmacenesfilter = this.almacenes.filter((s) => s.descripcion.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }

  filtroclientes(value) {
    this.dropdownclientesfilter = this.clientes.filter((s) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    if(this.dropdownclientesfilter.length == 0)
    {
      this.dropdownclientesfilter = this.clientes.filter((s) => s.descripcion.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }

  filtroembarcar(value) {

    this.dropdownembarcasfilter = this.embarcars.filter((s) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    if(this.dropdownembarcasfilter.length == 0)
    {
      this.dropdownembarcasfilter = this.embarcars.filter((s) => s.descripcion.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }

  ngOnInit() { 
    this.cargando = true;
    //Obtener Filtros de Usuario
    this._ordenService.obtenerFiltros().subscribe(
      response => {
        this.cargando = false;
        if(response.codigo == 200){
          this.rol = response.permisos;
          this.almacenes = response.almacenes.almacenesRow;
          this.almacenes.push({codigo:"",descripcion:"Todos los Almacenes"});
          this.dropdownalmacenesfilter = this.almacenes;
          this.clientes = response.clientes.clientesRow;
          this.clientes.push({codigo:"",descripcion:"Todos los Clientes"});
          this.dropdownclientesfilter = this.clientes;
          this.embarcars = response.embarcars.embarcarsRow;
          this.embarcars.push({codigo:"",descripcion:"Todos los Embarcar A"});
          this.dropdownembarcasfilter = this.embarcars;
          if(this.rol == 1 || this.rol == 2){
            this.limitado = true;
          }
          switch(this.rol){
            case 1: 
                this.inside = response.vendedor;
              break;
            case 2:
                this.vendedor = response.vendedor;
              break;
          }
        }
        else {
          this.rol = 0;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  mostrarReporte() {
    this.cargando = true;
    this.expandedDetailKeys = [];
    this.datos  = new Array<any>();
    this._ordenService.reporte(this.orden, this.site, this.region, this.vendido, this.vendedor, new Date(this.fecha1) , new Date(this.fecha2),this.inside,this.embarcar).subscribe(
      response => {
        try{
          if(response.Reporte.ReporteRow.length)
          {
            this.datos = response.Reporte.ReporteRow;
          } else {
            this.datos.push(response.Reporte.ReporteRow);
          }
          this.cargando = false;
          this.ordenarDatos();
        }
        catch(error){
          Swal.fire("Ups!","No se pudo obtener la informacion solicitada","error");
        }
      },
      error => {
        console.error(error);
        Swal.fire("Ups!","No se pudo obtener la informacion solicitada","error");
      }
    );
  }

  public expandDetailsBy = (dataItem: any): any => {
    return dataItem.llave_detalle;
  }

  ordenarDatos(){
    let datosOrdenados = new Array<any>();

    for(let i=0; i < this.datos.length; i++){
      let bandera = false;
      let posicion = 0;

      let almacen = this.datos[i].site;
      let zona = this.datos[i].region;
      let cliente = this.datos[i].cliente;
      let vendedor = this.datos[i].vendedor;
      let embarcar = this.datos[i].embarcar;
      let almacen_desc = this.datos[i].site_desc;
      let zona_desc = this.datos[i].region_desc;
      let cliente_desc = this.datos[i].cliente_nombre;
      let vendedor_desc = this.datos[i].vendedor_desc;      

  

      let detalles = {
        "orden" : this.datos[i].orden,
        "linea" : this.datos[i].linea,
        "parte" : this.datos[i].parte,
        "parte_descripcion" : this.datos[i].parte_descripcion,
        "um" : this.datos[i].um,
        "espesor" : this.datos[i].espesor,
        "ancho" : this.datos[i].ancho,
        "largo" : this.datos[i].largo,
        "grado" : this.datos[i].grado,
        "acabado" :this.datos[i].acabado,
        "orden_compra" : this.datos[i].orden_compra,
        "cantidad_ordenada" : this.datos[i].cantidad_ordenada,
        "cantidad_embarcada" : this.datos[i].cantidad_embarcada,
        "cantidad_pendiente" : this.datos[i].cantidad_pendiente,
        "fecha_vencimiento" : new Date(this.datos[i].fecha_vencimiento),
        "total_pt" : parseFloat(this.datos[i].total_pt).toFixed(2),
        "pt_um" : this.datos[i].pt_um
      };

      for(let x = 0; x < datosOrdenados.length; x++){
        if(
            datosOrdenados[x].almacen == almacen &&
            datosOrdenados[x].zona == zona &&
            datosOrdenados[x].cliente == cliente &&
            datosOrdenados[x].vendedor == vendedor &&
            datosOrdenados[x].embarcar == embarcar
          ){
             bandera = true;
             posicion = x;
            x = datosOrdenados.length + 1;
          }
      }

      if(bandera){
        datosOrdenados[posicion].detalles.push(detalles);
      } else {
        this.expandedDetailKeys.push(almacen+zona+cliente+vendedor+embarcar);
        datosOrdenados.push({
          "almacen" : almacen,
          "zona" : zona,
          "cliente" : cliente,
          "vendedor" : vendedor,
          "embarcar" : embarcar,
          "detalles" : [detalles],
          "llave_detalle" : almacen+zona+cliente+vendedor+embarcar,
          "almacen_desc" : almacen_desc,
          "zona_desc" : zona_desc,
          "cliente_desc" : cliente_desc,
          "vendedor_desc" : vendedor_desc
        });
      }

    }

    for(let i=0; i < datosOrdenados.length; i++){
      let total_ordenada : number = 0;
      let total_embarcada : number = 0;
      let total_pendiente : number = 0;
      for(let x =0; x < datosOrdenados[i].detalles.length; x++){
        total_ordenada += parseFloat(datosOrdenados[i].detalles[x].cantidad_ordenada);
        total_embarcada += parseFloat(datosOrdenados[i].detalles[x].cantidad_embarcada);
        total_pendiente += parseFloat(datosOrdenados[i].detalles[x].cantidad_pendiente);
      }
     // datosOrdenados[i].push({"total_ordenada": total_ordenada, "total_embarcada" : total_embarcada, "total_pendiente" : total_pendiente});
        datosOrdenados[i]["total_ordenada"] = total_ordenada.toFixed(2);
        datosOrdenados[i]["total_embarcada"] = total_embarcada.toFixed(2);
        datosOrdenados[i]["total_pendiente"] = total_pendiente.toFixed(2);
    }
    
    this.datos = datosOrdenados;
  }

  public exportarExcel(){
    this._ordenService.generarExcel(this.datos).subscribe(
      response => {
        if(response = 200){
          window.location.href = environment.apiurl + "/tempFiles/Ordenes.xlsx";
        }
      },
      error => {
        console.error(error);
      }
    );
  }


  public rowCallback(context: RowClassArgs) {
    let warning = false;
    let danger = false;
    let normal = false;
    let ok = false;

    let fechaActual = moment();
    let fechavencido = moment(context.dataItem.fecha_vencimiento);

  
    if(fechaActual > fechavencido){
      warning = false;
      danger = true;
      normal = false;
    }

    if (fechaActual.diff(fechavencido,'days') <= 3) {
      warning = true;
      danger = false;
      normal = false;
    }

    return {
      warning: warning,
      danger: danger,
      normal: normal,
      ok: ok
    };
  }

}


