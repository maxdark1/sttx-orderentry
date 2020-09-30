//Bibliotecas
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';

//Modelos
import { Cliente } from '../../../models/cliente.model';
import { Embarcar } from '../../../models/embarcar.model';
import { Parte } from '../../../models/parte.model';
import { OrdenVenta } from '../../../models/ordenventa.model';

//Dependencias KENDO
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { RowClassArgs } from '@progress/kendo-angular-grid';

//Servicios
import { OrdenService } from '../../../services/ordenVenta.service';
import { EstadisticaService } from '../../../services/estadistica.service';
import { configuracionService } from '../../../services/configuracion.service';

@Component({
  selector: 'app-gridpartes',
  templateUrl: './gridpartes.component.html',
  styleUrls: ['./gridpartes.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrdenService, EstadisticaService, configuracionService]
})
export class GridpartesComponent implements OnInit {
  //Inputs
  @Input() fechaInicio: Date;
  @Input() fechaFin: Date;
  @Input() cliente: Cliente;
  @Input() embarcar: Embarcar;
  @Input() tipoVenta: string;
  @Input() instancia: number;
  @Input() orden: OrdenVenta[] = new Array<OrdenVenta>();
  @Input() id: number = 1;
  @Input() semana: number = 0;
  @Input() folio: string = "";
  @Input() aprobada: boolean = false;
  public decimales: boolean = false;
  public dias : number = 0;
  //Outputs
  @Output() _orden: EventEmitter<OrdenVenta[]>;


  constructor(private _configuracionService : configuracionService, private formBuilder: FormBuilder, private _ordenService: OrdenService, private _estadisticaService: EstadisticaService) {
    this._orden = new EventEmitter();
  }

  ngOnInit() {
    let ultimovalor = 0;
    for (let i = 0; i < this.orden.length; i++) {
      if (this.orden[i].id > ultimovalor) {
        ultimovalor = this.orden[i].id;
      }
    }
    this.id = ultimovalor + 1;

    this._configuracionService.obtenerConfiguracionWeb('order_week_days').subscribe(
      Response => {
        this.dias = parseInt(Response[0][3]);
      }
    );

  }

  obtenerParte(parte: Parte) {
    //Llamar Web Service para traer la sugerencia de OV
   /* this._ordenService.obtenerPartes(parte, this.fechaInicio, this.fechaFin).subscribe(
      response => {
        //Validacion de Ordenes de Compra existentes en la Semana para la Misma Parte.
        if (response.codigo == 200) {
          let ordenes = "";
          if (response.ttOrden.ttOrdenRow[1]) {
            console.log(response.ttOrden.ttOrdenRow);
            for (var i = 0; i < response.ttOrden.ttOrdenRow.length; i++) {
              ordenes += "<b>Orden:</b> " + response.ttOrden.ttOrdenRow[i].orden + " <b>Cantidad:</b> " + response.ttOrden.ttOrdenRow[i].cantidad + " " + response.ttOrden.ttOrdenRow[i].UM + "<br>";
            }
          }
          else {
            ordenes += "<b>Orden:</b> " + response.ttOrden.ttOrdenRow.orden + " <b>Cantidad:</b> " + response.ttOrden.ttOrdenRow.cantidad + " " + response.ttOrden.ttOrdenRow.UM + "<br>";
          }

          swal.fire('Atencion', 'Se encontraron lineas de la <b>Parte:</b> ' + parte.codigo_int + ' en otras Ordenes de Venta para esta semana <br>' + ordenes + '<br> No se agrego la linea a la preorden', 'error');
        }
        //Si no existen Ordenes de Compra existentes en la semana para la Misma Parte se agrega. 
        else {
          if (response.codigo == 404) {
            //Traer estadistica de Venta para sugerir la Cantidad a Colocar en la Orden de Venta.
            this.sugerirCantidad(parte);
          }
        }

      },
      error => {
        console.error(error);
      });*/

      this.sugerirCantidad(parte);
  }


  public sugerirCantidad(parte: Parte) {
    //Se extraen mes y año de la fecha a trabajar.
    let mes = (this.fechaInicio.getMonth() + 1);
    let año = this.fechaInicio.getFullYear();
    //Se utiliza el Servicio para obtener la estadistica de Venta y Forecast de la Parte.
    this._estadisticaService.obtenerEstadistica(parte, mes, año,this.cliente.cliente,this.fechaFin).subscribe(
      response => {
        //Se verifica que existan datos.
        if (response.ttEstadistica.ttEstadisticaRow.lista_precio) {
          //Se verifica que exista un forecast mayor que 0 para la Parte.
          if (response.ttEstadistica.ttEstadisticaRow.pronostico > 0) {
            //Se agrega la linea a la OV con la sugerencia de colocacion.
            if(parte.um_facturacion == "CW")
            {
              let forecast = parseFloat(response.ttEstadistica.ttEstadisticaRow.pronostico);
              let linea = new OrdenVenta(this.cliente, this.embarcar, this.fechaInicio, this.fechaFin, this.fechaFin, parte, parseFloat((response.ttEstadistica.ttEstadisticaRow.pronostico / 4).toFixed(2)), '', '', '', '', '', '', 0, '', this.id, this.semana,parseFloat(forecast.toFixed(2)));
              this.id++;
              this.orden.push(linea);
              this._orden.emit(this.orden);
            }
            else{
              let forecast = parseFloat(response.ttEstadistica.ttEstadisticaRow.pronostico);
              let linea = new OrdenVenta(this.cliente, this.embarcar, this.fechaInicio, this.fechaFin, this.fechaFin, parte, parseFloat((response.ttEstadistica.ttEstadisticaRow.pronostico / 4).toFixed(0)), '', '', '', '', '', '', 0, '', this.id, this.semana,parseFloat(forecast.toFixed(0)));
              this.id++;
              this.orden.push(linea);
              this._orden.emit(this.orden);
            }
            
          }
          else{
            let linea = new OrdenVenta(this.cliente, this.embarcar, this.fechaInicio, this.fechaFin, this.fechaFin, parte, 0, '', '', '', '', '', '', 0, '', this.id, this.semana,0);
            this.id++;
            this.orden.push(linea);
            this._orden.emit(this.orden);
          }
        }
        else {
          // Si la parte no trae forecast se sugiere un 0
          swal.fire('Advertencia','La partida no cuenta con una lista vigente de precios para esta semana','warning');
        }
      },
      error => {
        console.error(error);
      }
    );
  }


  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    if (this.aprobada != true) {
      let fechaSolicitada = dataItem.fechaSolicitada.getDate() + "/" + (dataItem.fechaSolicitada.getMonth() + 1) + "/" + dataItem.fechaSolicitada.getFullYear();
      let fechaembarque = dataItem.fechaEmbarque.getDate() + "/" + (dataItem.fechaEmbarque.getMonth() + 1) + "/" + dataItem.fechaEmbarque.getFullYear();
      let fechapromesa = dataItem.fechaPromesa.getDate() + "/" + (dataItem.fechaPromesa.getMonth() + 1) + "/" + dataItem.fechaPromesa.getFullYear();
      if(dataItem.parte.um_facturacion == "CW"){
        this.decimales = true;
      }
      else{
        this.decimales = false;
      }
      return this.formBuilder.group({
        'fechaSolicitada': fechaSolicitada,
        'fechaEmbarque': fechaembarque,
        'fechaPromesa': fechapromesa,
        'cantidad': dataItem.cantidad,
        'oc_cliente': dataItem.oc_cliente,
        'comentario1': dataItem.comentario1,
        'comentario2': dataItem.comentario2,
        'comentario3': dataItem.comentario3,
        'comentario4': dataItem.comentario4,
        'comentario5': dataItem.comentario5,
      });
    }
  }

  public cellCloseHandler(args: any) {
    if (this.aprobada != true) {
      const { formGroup, dataItem } = args;
      let PartesFecha;

      PartesFecha = formGroup.value.fechaSolicitada.split('/');
      let fechaSolicitada = new Date(PartesFecha[2], PartesFecha[1] - 1, PartesFecha[0]);
      PartesFecha = formGroup.value.fechaEmbarque.split('/');
      let fechaEmbarque = new Date(PartesFecha[2], PartesFecha[1] - 1, PartesFecha[0]);
      PartesFecha = formGroup.value.fechaPromesa.split('/');
      let fechaPromesa = new Date(PartesFecha[2], PartesFecha[1] - 1, PartesFecha[0]);

      let validaciones = true;

      let fechaFinal: Date = new Date(this.fechaFin.setDate(this.fechaFin.getDate() + this.dias));
      
      if (fechaSolicitada < this.fechaInicio || fechaSolicitada > this.fechaFin) {
        validaciones = false;
      }
      if (fechaEmbarque < this.fechaInicio || fechaEmbarque > fechaFinal) {
        validaciones = false;
      }
      if (fechaPromesa < this.fechaInicio || fechaPromesa > fechaFinal) {
        validaciones = false;
      }

      if (validaciones) {
        dataItem.fechaSolicitada = fechaSolicitada;
        dataItem.fechaEmbarque = fechaEmbarque;
        dataItem.fechaPromesa = fechaPromesa;
        dataItem.oc_cliente = formGroup.value.oc_cliente;
        dataItem.comentario1 = formGroup.value.comentario1;
        dataItem.comentario2 = formGroup.value.comentario2;
        dataItem.comentario3 = formGroup.value.comentario3;
        dataItem.comentario4 = formGroup.value.comentario4;
        dataItem.comentario5 = formGroup.value.comentario5;

        if(this.decimales){
          dataItem.cantidad = parseFloat(formGroup.value.cantidad).toFixed(2);
        }
        else{
          dataItem.cantidad = parseFloat(formGroup.value.cantidad).toFixed(0);
        }

        this._orden.emit(this.orden);
      }
      else {
        swal.fire('Cuidado', 'El rango de fecha no puede ser mayor o menor a la semana indicada', 'warning');
      }
    }

  }

  public mostrarOVcreadas() {

  }

  public Eliminar(index, dataItem) {
    if (this.folio == "Nuevo") {
      let borrados = this.orden.splice(index, 1);
    }
    else {
      this._ordenService.borrarLinea(parseInt(this.folio), dataItem.parte.codigo_int, dataItem.id, dataItem.semana).subscribe(
        response => {
          if (response.ocode == 200) {
            let borrados = this.orden.splice(index, 1);
          }
          else {
            let borrados = this.orden.splice(index, 1);
            console.log(response.odescripcion);
          }
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  //Pintar GRID segun condicion
  public rowCallback(context: RowClassArgs) {
    let warning = false;
    let danger = false;
    let normal = false;
    let ok = false;

    if (context.dataItem.errorcode == "") {
      warning = false;
      danger = false;
      normal = true;
    }

    if (context.dataItem.errorcode != "" && parseInt(context.dataItem.errorcode) > 400) {
      warning = true;
      danger = false;
      normal = false;
    }

    if (context.dataItem.errorcode != "" && parseInt(context.dataItem.errorcode) < 400) {
      warning = false;
      danger = true;
      normal = false;
    }

    if (context.dataItem.errorcode == 200) {
      ok = true;
    }

    return {
      warning: warning,
      danger: danger,
      normal: normal,
      ok: ok
    };
  }

}
