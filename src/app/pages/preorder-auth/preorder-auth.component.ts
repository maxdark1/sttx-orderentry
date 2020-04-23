//Bibliotecas
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert2';
//Servicios
import { OrdenService } from '../../services/ordenVenta.service';
import { NotificacionService } from '../../services/notificacion.service';
import { EstadisticaService } from '../../services/estadistica.service';
//Dependencias KENDO
import { RowArgs } from '@progress/kendo-angular-grid';
import { RowClassArgs } from '@progress/kendo-angular-grid';
//Modelos
import { OrdenVenta } from '../../models/ordenventa.model';
import { Cliente } from '../../models/cliente.model';
import { Embarcar } from '../../models/embarcar.model';
import { Parte } from '../../models/parte.model';

@Component({
  selector: 'app-preorder-auth',
  templateUrl: './preorder-auth.component.html',
  styleUrls: ['./preorder-auth.component.css'],
  providers: [OrdenService, NotificacionService, EstadisticaService],
  encapsulation: ViewEncapsulation.None,
})
export class PreorderAuthComponent implements OnInit {

  public preorden: any[] = [];
  public miSeleccion: any[] = [];
  public encabezadoOrdenes: any;
  public detalleOrdenes: any[] = [];
  public noaprobado: number = 8; //El codigo 8 significa que el registro fue no aprobado
  public aprobado: number = 9; //El codigo 9 significa que el registro fue aprobado
  public cargando: boolean = false;
  public causa: string = "";
  //Codigo para seleccionar un elemento del grid por Folio
  public isRowSelected = (e: RowArgs) => this.miSeleccion.indexOf(e.dataItem.folio) >= 0;

  constructor(private _estadisticaService: EstadisticaService, private _ordenService: OrdenService, private _notificacionService: NotificacionService) { }

  ngOnInit() {
    this.obtenerPendientes();
  }

  public aprobar() {
    this.cargando = !this.cargando;
    let ordenes: OrdenVenta[] = [];
    for (let i = 0; i < this.detalleOrdenes.length; i++) {
      //Se genera un objeto Orden por cada Linea en la OV
      let orden: OrdenVenta = new OrdenVenta(new Cliente('', ''), new Embarcar('', ''), new Date, new Date, new Date, new Parte('', '', '', '', '', '', '', '', '', false, '', '', '', ''), 0, '', '', '', '', '', '', 0, '', 0, 0, 0);
      orden.cliente.cliente = this.encabezadoOrdenes.cliente;
      orden.embarcar.codigo = this.encabezadoOrdenes.embarcar;
      orden.fechaSolicitada = this.detalleOrdenes[i].fechaSolicitada;
      orden.fechaEmbarque = this.detalleOrdenes[i].fechaEmbarque;
      orden.fechaPromesa = this.detalleOrdenes[i].fechaPromesa;
      orden.parte.almacen = this.encabezadoOrdenes.almacen;
      orden.parte.codigo_int = this.detalleOrdenes[i].parte;
      orden.parte.codigo_cliente = 'Pendiente';
      orden.cantidad = this.detalleOrdenes[i].cantidad;
      orden.parte.um_facturacion = this.detalleOrdenes[i].um;
      if (this.detalleOrdenes[i].consignacion == "no") {
        orden.parte.tipoVenta = "directa";
      }
      else {
        orden.parte.tipoVenta = "consignacion";
      }
      orden.oc_cliente = this.detalleOrdenes[i].comentario1;
      orden.comentario1 = this.detalleOrdenes[i].comentario2;
      orden.comentario2 = this.detalleOrdenes[i].comentario3;
      orden.comentario3 = this.detalleOrdenes[i].comentario4;
      orden.comentario4 = this.detalleOrdenes[i].comentario5;
      orden.comentario5 = this.detalleOrdenes[i].comentario6;
      orden.id = this.detalleOrdenes[i].id;
      orden.semana = this.detalleOrdenes[i].semana;
      ordenes.push(orden);
    }

    this.guardarOVs(ordenes);
  }

  guardarOVs(ordenes: OrdenVenta[]) {
    this._ordenService.actualizarpreorden(parseInt(this.miSeleccion[0]), 2, 'si', 0, 0, '', ordenes).subscribe(
      response => {
        this.obtenerPendientes();
        swal.fire('OK!', 'Se actualizaron los datos de la Preorden', 'success');
        this.cargando = !this.cargando;
        this.detalleOrdenes = [];
      },
      error => {
        console.error(error);
        this.cargando = !this.cargando;
      }
    );
  }

  public noaprobar() {
    this._ordenService.noaprobar(this.encabezadoOrdenes.folio, this.noaprobado, this.causa).subscribe(
      response => {
        if (response.code == 200) {
          //Iniciar Instrucciones para notificar a Inside Sales la No Aprobacion de su OV
          this._notificacionService.obtenerCorreoxUsuario(this.encabezadoOrdenes.usuario).subscribe(
            response => {
              if (response.ocode == 200) {
                let mail = response.mail;
                this._notificacionService.enviarCorreo(mail, 'Preorden de Venta Desaprobada Cliente ' + this.encabezadoOrdenes.cliente, 'La preorden con folio:<b>' + this.encabezadoOrdenes.folio + '</b> para el cliente:<b>' + this.encabezadoOrdenes.cliente_desc + '</b> fue rechazada por la siguiente causa: <br><br> <b>' + this.causa + '</b>', 'Favor de Comunicarse con el Area de Planeacion de Materiales').subscribe();
                this.causa = "";
                this.encabezadoOrdenes = null;
                this.detalleOrdenes = [];
                this.preorden = [];
                this.obtenerPendientes();
                swal.fire('OK', 'Registro Guardado con Exito', 'success');
              }
              else {
                console.log("No se encontro correo para notificar");
              }
            },
            error => {
              console.error(error);
            }
          );

        }
        else {
          swal.fire('Ups', response.descripcion, 'warning');
        }
      },
      error => {
        console.error("Ocurrio un error al consumir el Web Service [wsnoaprobov] " + error);
      }
    );
  }

  public obtenerPendientes() {
    this.preorden = new Array<any>();
    this.detalleOrdenes = new Array<any>();
    this._ordenService.obtenerlistapreordenes(1).subscribe(
      response => {
        if (response.code == 200) {
          if (response.preordenes.preordenesRow.length) {
            this.preorden = response.preordenes.preordenesRow;
          }
          else {
            this.preorden.push(response.preordenes.preordenesRow);
          }
          //Rutina para convertir las Fechas de String a DATE
          for (var i = 0; i < this.preorden.length; i++) {
            this.preorden[i].fecha = new Date(this.preorden[i].fecha);
          }
        }
        else {
          console.error('Error', 'Codigo: ' + response.code + ' Descripcion: ' + response.descripcion, 'warning')
        }
      },
      error => {
        console.error(error);
        swal.fire("ERROR", "Ocurrio un error al llamar al WebService 'Preordenes Pendientes #1'", "error");
      }
    );
  }

  public seleccionarPreorden(dataItem) {
    this.miSeleccion.pop();
    this.miSeleccion.push(dataItem.folio);
    this.obtenerDetalle(dataItem);
  }

  public obtenerDetalle(dataItem) {
    this.encabezadoOrdenes = dataItem;
    this.detalleOrdenes = [];
    let data = [];
    this._ordenService.obtenerdetallepreordenes2(dataItem.folio).subscribe(
      response => {
        if (response.ocode == 200) {
          //Con el detalle de las Preordenes se gestionara la Vista para la revision de las mismas
          if (response.DETALLE.DETALLERow.length) {
            data = response.DETALLE.DETALLERow;
          }
          else {
            data.push(response.DETALLE.DETALLERow);
          }

          for (let i = 0; i < data.length; i++) {
            //Rutina para convertir las Fechas de String a DATE
            data[i].fechaPromesa = new Date(data[i].fechaPromesa);
            data[i].fechaEmbarque = new Date(data[i].fechaEmbarque);
            data[i].fechaSolicitada = new Date(data[i].fechaSolicitada);
            //  Obtener el Forecast 
            let mes = (data[i].fechaPromesa.getMonth() + 1);
            let año = data[i].fechaPromesa.getFullYear();
            let parte: Parte = new Parte(data[i].parte, '', '', '', '', '', '', '', '', false, '', '', '', '');
            this._estadisticaService.obtenerEstadistica(parte, mes, año, this.encabezadoOrdenes.cliente, data[i].fechaPromesa).subscribe(
              response => {
                //Se verifica que existan datos.
                if (response.ttEstadistica.ttEstadisticaRow) {
                  //Se verifica que exista un forecast mayor que 0 para la Parte.
                  if (response.ttEstadistica.ttEstadisticaRow.pronostico > 0) {
                    let forecast = parseFloat(response.ttEstadistica.ttEstadisticaRow.pronostico);
                    let consignacion;
                      if(data[i].consignacion){
                        consignacion = "si";
                      }else{
                        consignacion = "no"
                      }
                    if (data[i].um == "CW") {
                      this.detalleOrdenes.push({
                        'folio': data[i].folio,
                        'parte': data[i].parte,
                        'cantidad': data[i].cantidad,
                        'um': data[i].um,
                        'consignacion': consignacion,
                        'comentario1': data[i].comentario1,
                        'comentario2': data[i].comentario2,
                        'comentario3': data[i].comentario3,
                        'comentario4': data[i].comentario4,
                        'comentario5': data[i].comentario5,
                        'comentario6': data[i].comentario6,
                        'dominio': data[i].dominio,
                        'fechaSolicitada': data[i].fechaSolicitada,
                        'fechaEmbarque': data[i].fechaEmbarque,
                        'fechaPromesa': data[i].fechaPromesa,
                        'ov': data[i].ov,
                        'linea': data[i].linea,
                        'estado': data[i].estado,
                        'errordesc': data[i].errordesc,
                        'semana': data[i].semana,
                        'id': data[i].id,
                        'pronostico': forecast.toFixed(2)
                      });
                    }
                    else {
                      this.detalleOrdenes.push({
                        'folio': data[i].folio,
                        'parte': data[i].parte,
                        'cantidad': data[i].cantidad,
                        'um': data[i].um,
                        'consignacion': consignacion,
                        'comentario1': data[i].comentario1,
                        'comentario2': data[i].comentario2,
                        'comentario3': data[i].comentario3,
                        'comentario4': data[i].comentario4,
                        'comentario5': data[i].comentario5,
                        'comentario6': data[i].comentario6,
                        'dominio': data[i].dominio,
                        'fechaSolicitada': data[i].fechaSolicitada,
                        'fechaEmbarque': data[i].fechaEmbarque,
                        'fechaPromesa': data[i].fechaPromesa,
                        'ov': data[i].ov,
                        'linea': data[i].linea,
                        'estado': data[i].estado,
                        'errordesc': data[i].errordesc,
                        'semana': data[i].semana,
                        'id': data[i].id,
                        'pronostico': forecast.toFixed(0)
                      });
                    }
                  }
                  else {
                    let consignacion;
                    if(data[i].consignacion){
                      consignacion = "si";
                    }else{
                      consignacion = "no"
                    }
                    this.detalleOrdenes.push({
                      'folio': data[i].folio,
                      'parte': data[i].parte,
                      'cantidad': data[i].cantidad,
                      'um': data[i].um,
                      'consignacion': consignacion,
                      'comentario1': data[i].comentario1,
                      'comentario2': data[i].comentario2,
                      'comentario3': data[i].comentario3,
                      'comentario4': data[i].comentario4,
                      'comentario5': data[i].comentario5,
                      'comentario6': data[i].comentario6,
                      'dominio': data[i].dominio,
                      'fechaSolicitada': data[i].fechaSolicitada,
                      'fechaEmbarque': data[i].fechaEmbarque,
                      'fechaPromesa': data[i].fechaPromesa,
                      'ov': data[i].ov,
                      'linea': data[i].linea,
                      'estado': data[i].estado,
                      'errordesc': data[i].errordesc,
                      'semana': data[i].semana,
                      'id': data[i].id,
                      'pronostico': 0
                    });
                  }
                }
              },
              error => {
                console.log(error);
              });
          }
        }
        else {
          swal.fire('Error', 'Codigo: ' + response.code + ' Descripcion: ' + response.descripcion, 'warning');
        }

      },
      error => {
        console.error(error);
        swal.fire("ERROR", "Ocurrio un error al llamar al WebService 'Detalle de Preordenes #1'", "error");
      }
    );
  }

  public rowCallback(context: RowClassArgs) {
    let warning = false;
    let danger = false;
    let normal = false;
    let ok = false;

    if (context.dataItem.estado == "") {
      warning = false;
      danger = false;
      normal = true;
    }

    if (context.dataItem.estado != "" && parseInt(context.dataItem.estado) > 400) {
      warning = true;
      danger = false;
      normal = false;
    }

    if (context.dataItem.estado != "" && parseInt(context.dataItem.estado) < 400) {
      warning = false;
      danger = true;
      normal = false;
    }

    if (context.dataItem.estado == 200) {
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
