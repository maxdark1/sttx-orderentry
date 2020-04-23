//Bibliotecas
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

//Modelos
import { Cliente } from '../../models/cliente.model';
import { Embarcar } from 'app/models/embarcar.model';
import { OrdenVenta } from '../../models/ordenventa.model';

//Servicios
import { OrdenService } from '../../services/ordenVenta.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Parte } from 'app/models/parte.model';
import { EstadisticaService } from '../../services/estadistica.service';
import { configuracionService } from '../../services/configuracion.service';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.component.html',
  styleUrls: ['./preorder.component.css'],
  providers: [OrdenService, NotificacionService, EstadisticaService, configuracionService]
})
export class PreorderComponent implements OnInit {
  public cliente: Cliente = new Cliente('', '');
  public embarcar: Embarcar = new Embarcar('', '');
  public tipoVenta: string = "";
  public almacen: string = "";
  public generar: boolean = false;
  public cargando: boolean = false;
  public pronosticoMensual: number = 0;
  public ovMensual: number = 0;
  public totalRegistros: number = 0;
  public validado: Boolean = false;
  public autorizacion: Boolean = false;
  public folio: string = "";
  public buttonText: string = "GENERAR OV";
  public aprobada: boolean = false;
  public terminado: boolean = false;

  public orden1: OrdenVenta[] = new Array<OrdenVenta>();
  public orden2: OrdenVenta[] = new Array<OrdenVenta>();
  public orden3: OrdenVenta[] = new Array<OrdenVenta>();
  public orden4: OrdenVenta[] = new Array<OrdenVenta>();
  public orden5: OrdenVenta[] = new Array<OrdenVenta>();

  public orden1Response = new Array<any>();
  public orden2Response = new Array<any>();
  public orden3Response = new Array<any>();
  public orden4Response = new Array<any>();
  public orden5Response = new Array<any>();

  public fdfw: Date;
  public ldfw: Date;

  public fdsw: Date;
  public ldsw: Date;

  public fdtw: Date;
  public ldtw: Date;

  public fdlw: Date;
  public ldlw: Date;

  public fdew: Date;
  public ldew: Date;

  constructor(private _ordenService: OrdenService,
    private _notificacionService: NotificacionService,
    private _estadisticaService: EstadisticaService,
    private _configuracionService : configuracionService,
    private router: Router) {

  }

  ngOnInit() {
    if (typeof history.state.dataItem != 'undefined') {
      if (typeof history.state.dataItem.cliente != 'undefined') {
        let cliente: Cliente = new Cliente(history.state.dataItem.cliente, history.state.dataItem.cliente_descripcion);
        this.cliente = cliente;
        let embarcar: Embarcar = new Embarcar(history.state.dataItem.embarcar, history.state.dataItem.embarcar_desc);
        this.embarcar = embarcar;
        this.tipoVenta = history.state.dataItem.tipoVenta;
        this.almacen = history.state.dataItem.almacen;
        if (history.state.dataItem.status == "Aprobada") {
          this.aprobada = true;
        }

        this.fdfw = moment(history.state.dataItem.fecha).day("Monday").toDate();
        this.fdfw.setHours(0, 0, 0, 0);
        this.ldfw = moment(history.state.dataItem.fecha).day("Monday").day(6).toDate();
        this.ldfw.setHours(0, 0, 0, 0);

        this.fdsw = moment(history.state.dataItem.fecha).day("Monday").day(8).toDate();
        this.fdsw.setHours(0, 0, 0, 0);
        this.ldsw = moment(history.state.dataItem.fecha).day("Monday").day(13).toDate();
        this.ldsw.setHours(0, 0, 0, 0);

        this.fdtw = moment(history.state.dataItem.fecha).day("Monday").day(15).toDate();
        this.fdtw.setHours(0, 0, 0, 0);
        this.ldtw = moment(history.state.dataItem.fecha).day("Monday").day(20).toDate();
        this.ldtw.setHours(0, 0, 0, 0);

        this.fdlw = moment(history.state.dataItem.fecha).day("Monday").day(22).toDate();
        this.fdlw.setHours(0, 0, 0, 0);
        this.ldlw = moment(history.state.dataItem.fecha).day("Monday").day(27).toDate();
        this.ldlw.setHours(0, 0, 0, 0);

        this.ldew = new Date();
        this.fdew = moment(history.state.dataItem.fecha).day("Monday").day(29).toDate();
        this.fdew.setHours(0,0,0,0);
        this.ldew.setDate(this.fdew.getDate() + 397);

        //Obtener Detalle del encabezado seleccionado
        this.folio = history.state.dataItem.folio;
        this.obtenerDetalle(history.state.dataItem.folio);
      }
      else {
        //Inicializar para registro Nuevo.
        this.fdfw = moment().day("Monday").toDate();
        this.fdfw.setHours(0, 0, 0, 0);
        this.ldfw = moment().day("Monday").day(6).toDate();
        this.ldfw.setHours(0, 0, 0, 0);

        this.fdsw = moment().day("Monday").day(8).toDate();
        this.fdsw.setHours(0, 0, 0, 0);
        this.ldsw = moment().day("Monday").day(13).toDate();
        this.ldsw.setHours(0, 0, 0, 0);

        this.fdtw = moment().day("Monday").day(15).toDate();
        this.fdtw.setHours(0, 0, 0, 0);
        this.ldtw = moment().day("Monday").day(20).toDate();
        this.ldtw.setHours(0, 0, 0, 0);

        this.fdlw = moment().day("Monday").day(22).toDate();
        this.fdlw.setHours(0, 0, 0, 0);
        this.ldlw = moment().day("Monday").day(27).toDate();
        this.ldlw.setHours(0, 0, 0, 0);

        this.ldew = new Date();
        this.fdew = moment().day("Monday").day(29).toDate();
        this.fdew.setHours(0,0,0,0);
        this.ldew.setDate(this.fdew.getDate() + 397);

        let cliente: Cliente = new Cliente('', '');
        let embarcar: Embarcar = new Embarcar('', '');
        this.cliente = cliente;
        this.embarcar = embarcar;
        this.tipoVenta = "";
        this.folio = "Nuevo";
        this.aprobada = false;
      }
    }
    else {
      //Inicializar para registro Nuevo.
      this.fdfw = moment().day("Monday").toDate();
      this.fdfw.setHours(0, 0, 0, 0);
      this.ldfw = moment().day("Monday").day(6).toDate();
      this.ldfw.setHours(0, 0, 0, 0);

      this.fdsw = moment().day("Monday").day(8).toDate();
      this.fdsw.setHours(0, 0, 0, 0);
      this.ldsw = moment().day("Monday").day(13).toDate();
      this.ldsw.setHours(0, 0, 0, 0);

      this.fdtw = moment().day("Monday").day(15).toDate();
      this.fdtw.setHours(0, 0, 0, 0);
      this.ldtw = moment().day("Monday").day(20).toDate();
      this.ldtw.setHours(0, 0, 0, 0);

      this.fdlw = moment().day("Monday").day(22).toDate();
      this.fdlw.setHours(0, 0, 0, 0);
      this.ldlw = moment().day("Monday").day(27).toDate();
      this.ldlw.setHours(0, 0, 0, 0);

      this.ldew = new Date();
      this.fdew = moment().day("Monday").day(29).toDate();
      this.fdew.setHours(0,0,0,0);
      this.ldew.setDate(this.fdew.getDate() + 397);

      let cliente: Cliente = new Cliente('', '');
      let embarcar: Embarcar = new Embarcar('', '');
      this.cliente = cliente;
      this.embarcar = embarcar;
      this.tipoVenta = "";
      this.folio = "Nuevo";

    }

  }

  irLista() {
    this.router.navigate(['/preorder-list']);
  }

  obtenerDetalle(folio: number) {
    this._ordenService.obtenerdetallepreordenes2(folio).subscribe(
      response => {
        let contador: number = 0;
        /*Codigo para generar el Detalle*/
        let data: any[] = new Array<any>();
        if (response.ocode == 200) {
          //Con el detalle de las Preordenes se gestionara la Vista para la revision de las mismas
          if (response.DETALLE.DETALLERow.length) {
            data = response.DETALLE.DETALLERow;
          }
          else {
            data.push(response.DETALLE.DETALLERow);
          }
        }

        for (let i = 0; i < data.length; i++) {
          let consignacion = 'consignacion';
          if (data[i].consignacion) {
            consignacion = 'consignacion';
          }
          else {
            consignacion = 'directa';
          }

          let parte: Parte = new Parte(data[i].parte, '', this.cliente.cliente, this.embarcar.codigo, data[i].um, data[i].um, '', '', '', false, '', '', consignacion, this.almacen);

          let fechaSolicitada = data[i].fechaSolicitada.split('-');
          let fechaEmbarque = data[i].fechaEmbarque.split('-');
          let fechaPromesa = data[i].fechaPromesa.split('-');

          fechaSolicitada = new Date(fechaSolicitada[0], (fechaSolicitada[1] - 1), fechaSolicitada[2], 0, 0, 0, 0);
          fechaEmbarque = new Date(fechaEmbarque[0], (fechaEmbarque[1] - 1), fechaEmbarque[2], 0, 0, 0, 0);
          fechaPromesa = new Date(fechaPromesa[0], (fechaPromesa[1] - 1), fechaPromesa[2], 0, 0, 0, 0);

          let mes = (fechaSolicitada.getMonth() + 1);
          let año = fechaSolicitada.getFullYear();
          //Se utiliza el Servicio para obtener la estadistica de Venta y Forecast de la Parte.
          this._estadisticaService.obtenerEstadistica(parte, mes, año,this.cliente.cliente,fechaPromesa).subscribe(respuesta => {
            if (parseInt(respuesta.ttEstadistica.ttEstadisticaRow.pronostico) > 0) {
              let linea: OrdenVenta = new OrdenVenta(this.cliente,
                this.embarcar,
                fechaSolicitada,
                fechaEmbarque,
                fechaPromesa,
                parte,
                data[i].cantidad,
                data[i].comentario1,
                data[i].comentario2,
                data[i].comentario3,
                data[i].comentario4,
                data[i].comentario5,
                data[i].comentario6,
                0,
                '',
                data[i].id,
                0,
                respuesta.ttEstadistica.ttEstadisticaRow.pronostico);
                
              if (data[i].semana == 1) {
                linea.semana = 1;
                this.orden1.push(linea);
              }
              if (data[i].semana == 2) {
                linea.semana = 2;
                this.orden2.push(linea);
              }
              if (data[i].semana == 3) {
                linea.semana = 3;
                this.orden3.push(linea);
              }
              if (data[i].semana == 4) {
                linea.semana = 4;
                this.orden4.push(linea);
              }
              if (data[i].semana == 5) {
                linea.semana = 5;
                this.orden5.push(linea);
              }
              contador++;
              if (contador == data.length) {
                this.validaciones();
                this.validarOVs();
              }
            }
            else {
              let linea: OrdenVenta = new OrdenVenta(this.cliente,
                this.embarcar,
                fechaSolicitada,
                fechaEmbarque,
                fechaPromesa,
                parte,
                data[i].cantidad,
                data[i].comentario1,
                data[i].comentario2,
                data[i].comentario3,
                data[i].comentario4,
                data[i].comentario5,
                data[i].comentario6,
                0,
                '',
                data[i].id,
                0,
                0);

              if (data[i].semana == 1) {
                linea.semana = 1;
                this.orden1.push(linea);
              }
              if (data[i].semana == 2) {
                linea.semana = 2;
                this.orden2.push(linea);
              }
              if (data[i].semana == 3) {
                linea.semana = 3;
                this.orden3.push(linea);
              }
              if (data[i].semana == 4) {
                linea.semana = 4;
                this.orden4.push(linea);
              }
              if (data[i].semana == 5) {
                linea.semana = 5;
                this.orden5.push(linea);
              }
              contador++;
              if(contador == data.length) {
                this.validaciones();
                this.validarOVs();
              }
            }
          });

        }
      },
      error => {
        console.error("Ocurrio un error al Consumir el Web Service [wsgetovdetails] " + error);
      }
    );
  }

  obtenerCliente(cliente: Cliente) {
    this.cliente = cliente;
  }

  obtenerEmbarcar(embarcar: Embarcar) {
    this.embarcar = embarcar;
  }

  validaciones() {
    if (this.cliente && this.tipoVenta && this.almacen) {
      this.generar = true;
    }
    else {
      swal.fire('No podemos continuar', 'Es necesario llenar los campos obligatorios para continuar', 'warning');
    }
  }

  generarOV() {
    if (this.folio != 'Nuevo') {
      if (this.autorizacion == true) {
        //Solicitud de Autorizacion
        this.cargando = !this.cargando;
        let lineas = new Array<OrdenVenta>();
        /*Juntar Semanas en 1 Sola peticion*/
        if (this.orden1) {
          for (let i = 0; i < this.orden1.length; i++) {
            lineas.push(this.orden1[i]);
          }
        }

        if (this.orden2) {
          for (let i = 0; i < this.orden2.length; i++) {
            lineas.push(this.orden2[i]);
          }
        }

        if (this.orden3) {
          for (let i = 0; i < this.orden3.length; i++) {
            lineas.push(this.orden3[i]);
          }
        }

        if (this.orden4) {
          for (let i = 0; i < this.orden4.length; i++) {
            lineas.push(this.orden4[i]);
          }
        }

        if(this.orden5){
          for (let i= 0; i < this.orden5.length; i++){
            lineas.push(this.orden5[i]);
          }
        }

        this._ordenService.actualizarpreorden(parseInt(this.folio), 1, '', 0, 0, '', lineas).subscribe(
          response => {
            swal.fire('OK!', 'Se actualizaron los datos de la Preorden', 'success');
            this.cargando = !this.cargando;
          },
          error => {
            console.error(error);
            this.cargando = !this.cargando;
          }
        );
      }
      else {
        //Guardado directo de las Ordenes de Venta
        this.guardarOrdenes();
      }
    }
    else {
      swal.fire('Ups', 'Es necesario generar un folio de preorden antes de generar la OV', 'warning');
    }
  }

  guardarOrdenes() {
    //Indicar Carga
    this.cargando = !this.cargando;
    let lineas = new Array<OrdenVenta>();
    /*Juntar Semanas en 1 Sola peticion*/
    if (this.orden1) {
      for (let i = 0; i < this.orden1.length; i++) {
        lineas.push(this.orden1[i]);
      }
    }

    if (this.orden2) {
      for (let i = 0; i < this.orden2.length; i++) {
        lineas.push(this.orden2[i]);
      }
    }

    if (this.orden3) {
      for (let i = 0; i < this.orden3.length; i++) {
        lineas.push(this.orden3[i]);
      }
    }

    if (this.orden4) {
      for (let i = 0; i < this.orden4.length; i++) {
        lineas.push(this.orden4[i]);
      }
    }

    if(this.orden5){
      for(let i = 0; i < this.orden5.length; i++){
        lineas.push(this.orden5[i]);
      }
    }

    if (this.folio != "Nuevo") {
      this._ordenService.actualizarpreorden(parseInt(this.folio), 9, '', 1, 0, '', lineas).subscribe(
        response => {
          this._ordenService.validarOV(lineas, "SAVE").subscribe(
            response => {
              console.log("Entro a generar OV");
              console.log(response);
              let data: any[] = new Array<any>();
              if (Array.isArray(response.tt_out_ordenventaRow)) {
                //Con el detalle de las Preordenes se gestionara la Vista para la revision de las mismas
                data = response.tt_out_ordenventaRow;
              }
              else {
                data.push(response.tt_out_ordenventaRow);
              }
              for (let i = 0; i < data.length; i++) {
                //Integrar Respuesta.
                //Semana 1
                if (data[i].tt_out_semana == 1) {
                  for (let x = 0; x < this.orden1.length; x++) {
                    if (this.orden1[x].id == data[i].tt_out_indice) {
                      this.orden1[x].ov = data[i].tt_out_ov;
                      this.orden1[x].linea = data[i].tt_out_ov_ln;
                    }
                  }
                }
                //Semana 2
                if (data[i].tt_out_semana == 2) {
                  for (let x = 0; x < this.orden2.length; x++) {
                    if (this.orden2[x].id == data[i].tt_out_indice) {
                      this.orden2[x].ov = data[i].tt_out_ov;
                      this.orden2[x].linea = data[i].tt_out_ov_ln;
                    }
                  }
                }
                //Semana 3
                if (data[i].tt_out_semana == 3) {
                  for (let x = 0; x < this.orden3.length; x++) {
                    if (this.orden3[x].id == data[i].tt_out_indice) {
                      this.orden3[x].ov = data[i].tt_out_ov;
                      this.orden3[x].linea = data[i].tt_out_ov_ln;
                    }
                  }
                }
                //Semana 4
                if (data[i].tt_out_semana == 4) {
                  for (let x = 0; x < this.orden4.length; x++) {
                    if (this.orden4[x].id == data[i].tt_out_indice) {
                      this.orden4[x].ov = data[i].tt_out_ov;
                      this.orden4[x].linea = data[i].tt_out_ov_ln;
                    }
                  }
                }
                //Semana 5
                if (data[i].tt_out_semana == 5) {
                  for (let x = 0; x < this.orden5.length; x++) {
                    if (this.orden5[x].id == data[i].tt_out_indice) {
                      this.orden5[x].ov = data[i].tt_out_ov;
                      this.orden5[x].linea = data[i].tt_out_ov_ln;
                    }
                  }
                }
              }
              this.cargando = !this.cargando;
              this.actualizarpreOrden(true, 9, 1);
            },
            error => {
              this.cargando = !this.cargando;
              console.error(error);
            }
          );
        },
        error => {
          console.error(error);
          this.cargando = !this.cargando;
        }
      );
    }
    else {
      this.cargando = !this.cargando;
      swal.fire('Ups', 'Es necesario generar un folio de preorden antes de generar la OV', 'warning');
    }
  }


  revisarFolio() {
    if (this.folio == "Nuevo") {
      this.guardarpreOrden();
    }
    else {
      this.actualizarpreOrden(false, 0, 0);
    }
  }

  actualizarpreOrden(ov: boolean, status: number, terminado: number) {
    this.cargando = !this.cargando;
    let lineas = new Array<OrdenVenta>();
    /*Juntar Semanas en 1 Sola peticion*/
    if (this.orden1) {
      for (let i = 0; i < this.orden1.length; i++) {
        lineas.push(this.orden1[i]);
      }
    }

    if (this.orden2) {
      for (let i = 0; i < this.orden2.length; i++) {
        lineas.push(this.orden2[i]);
      }
    }

    if (this.orden3) {
      for (let i = 0; i < this.orden3.length; i++) {
        lineas.push(this.orden3[i]);
      }
    }

    if (this.orden4) {
      for (let i = 0; i < this.orden4.length; i++) {
        lineas.push(this.orden4[i]);
      }
    }

    if(this.orden5){
      for (let i = 0; i < this.orden5.length; i++){
        lineas.push(this.orden5[i]);
      }
    }

    this._ordenService.actualizarpreorden(parseInt(this.folio), status, '', terminado, 0, '', lineas).subscribe(
      response => {
        swal.fire('OK!', 'Se actualizaron los datos de la Preorden', 'success');
        this.cargando = !this.cargando;
        if (ov) {
          this.terminado = true;
        }
      },
      error => {
        console.error(error);
        this.cargando = !this.cargando;
      }
    );
  }

  guardarpreOrden() {
    this.cargando = !this.cargando;
    let embarcar;
    let cliente;
    let tipoVenta;
    if (this.orden1.length) {
      embarcar = this.orden1[0].parte.embarcar;
      cliente = this.orden1[0].cliente.cliente;
      tipoVenta = this.orden1[0].parte.tipoVenta;
    } else if (this.orden2.length) {
      embarcar = this.orden2[0].parte.embarcar;
      cliente = this.orden2[0].cliente.cliente;
      tipoVenta = this.orden2[0].parte.tipoVenta;
    } else if (this.orden3.length) {
      embarcar = this.orden3[0].parte.embarcar;
      cliente = this.orden3[0].cliente.cliente;
      tipoVenta = this.orden3[0].parte.tipoVenta;
    } else if (this.orden4.length) {
      embarcar = this.orden4[0].parte.embarcar;
      cliente = this.orden4[0].cliente.cliente;
      tipoVenta = this.orden4[0].parte.tipoVenta;
    } else if (this.orden5.length){
      embarcar = this.orden5[0].parte.embarcar;
      cliente = this.orden5[0].cliente.cliente;
      tipoVenta = this.orden5[0].parte.tipoVenta;
    }

    let lineas = new Array<OrdenVenta>();
    //Juntamos las 4 semanas en una sola peticion
    if (this.orden1) {
      for (let i = 0; i < this.orden1.length; i++) {
        this.orden1[i].ov = "";
        this.orden1[i].linea = 0;
        this.orden1[i].semana = 1;
        lineas.push(this.orden1[i]);
      }
    }

    if (this.orden2) {
      for (let i = 0; i < this.orden2.length; i++) {
        this.orden2[i].ov = "";
        this.orden2[i].linea = 0;
        this.orden2[i].semana = 2;
        lineas.push(this.orden2[i]);
      }
    }

    if (this.orden3) {
      for (let i = 0; i < this.orden3.length; i++) {
        this.orden3[i].ov = "";
        this.orden3[i].linea = 0;
        this.orden3[i].semana = 3;
        lineas.push(this.orden3[i]);
      }
    }

    if (this.orden4) {
      for (let i = 0; i < this.orden4.length; i++) {
        this.orden4[i].ov = "";
        this.orden4[i].linea = 0;
        this.orden4[i].semana = 4;
        lineas.push(this.orden4[i]);
      }
    }

    if (this.orden5) {
      for (let i = 0; i < this.orden5.length; i++) {
        this.orden5[i].ov = "";
        this.orden5[i].linea = 0;
        this.orden5[i].semana = 5;
        lineas.push(this.orden5[i]);
      }
    }

    //Se guarda la preorden
    if (lineas) {
      this._ordenService.generarpreOrder(0, this.almacen, embarcar, cliente, tipoVenta, '', 0, lineas).subscribe(
        response => {
          if (response.ocode == 200) {
            this.folio = response.ofolio;
            swal.fire('OK', 'Preorden generada con el folio:<b>' + this.folio + '</b>', 'success');
            this.cargando = !this.cargando;
          }
          else {
            console.log("Ocurrio un error al guardar la preorden");
          }
        },
        error => { console.log(error) });
    }
    else {
      swal.fire('Ups', 'no se encontraron lineas a guardar', 'warning')
      this.cargando = !this.cargando;
    }

  }

  notificacionPreorden() {
    //Notificar y posteriormente soltar el mensaje y enviar el Correo
    this._notificacionService.obtenerCorreos('10', 'OV_AUT', 'OV_AUT').subscribe(
      response => {
        let titulo = response.titulo;
        let cuerpo = response.cuerpo;
        let pie = response.pie;
        let json = JSON.parse(response.correos);
        let correos = "";
        for (let i = 0; i < json.root.users.length; i++) {
          if (i + 1 == json.root.users.length) {
            correos += json.root.users[i].Correo;
          }
          else {
            correos += json.root.users[i].Correo + ',';
          }

        }
        this._notificacionService.enviarCorreo(correos, titulo, cuerpo, pie).subscribe(
          response => {
            this.cargando = !this.cargando;
            swal.fire('OK', 'Datos guardados con exito', 'success')
          },
          error => {
            console.error("Error al Consumir el WS 'Envio de Correos' " + error);
          }
        );
      },
      error => {
        console.error("Error al consumir Web Service 'Obtener Correos: '" + error);
      }
    );

  }

  validarOVs() {
    this.cargando = !this.cargando;
    this.orden1Response = new Array<any>();
    this.orden2Response = new Array<any>();
    this.orden3Response = new Array<any>();
    this.orden4Response = new Array<any>();
    this.orden5Response = new Array<any>();
    //Valida Semana 1
    if (this.orden1.length > 0) {
      this._ordenService.validarOV(this.orden1, "VALIDATE").subscribe(
        response => {
          if (response.tt_out_ordenventaRow.length) {
            this.orden1Response = response.tt_out_ordenventaRow;
          }
          else {
            this.orden1Response.push(response.tt_out_ordenventaRow);
          }
          if (this.orden1Response.length < 1) {
            this.orden1Response.push('nodata');
          }
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        },
        error => {
          this.orden1Response.push('nodata');
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        }
      );
    }
    else {
      this.orden1Response.push('nodata');
      if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
        this.siguienteValidacion();
      }
    }

    //Valida Semana 2
    if (this.orden2.length > 0) {
      this._ordenService.validarOV(this.orden2, "VALIDATE").subscribe(
        response => {
          if (response.tt_out_ordenventaRow.length) {
            this.orden2Response = response.tt_out_ordenventaRow;
          }
          else {
            this.orden2Response.push(response.tt_out_ordenventaRow);
          }
          if (this.orden2Response.length < 1) {
            this.orden2Response.push('nodata');
          }
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        },
        error => {
          this.orden2Response.push('nodata');
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        }
      );
    }
    else {
      this.orden2Response.push('nodata');
      if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
        this.siguienteValidacion();
      }
    }
    //Valida Semana 3
    if (this.orden3.length > 0) {
      this._ordenService.validarOV(this.orden3, "VALIDATE").subscribe(
        response => {
          if (response.tt_out_ordenventaRow.length) {
            this.orden3Response = response.tt_out_ordenventaRow;
          }
          else {
            this.orden3Response.push(response.tt_out_ordenventaRow);
          }
          if (this.orden3Response.length < 1) {
            this.orden3Response.push('nodata');
          }
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        },
        error => {
          this.orden3Response.push('nodata');
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        }
      );
    }
    else {
      this.orden3Response.push('nodata');
      if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
        this.siguienteValidacion();
      }
    }
    //Valida Semana 4
    if (this.orden4.length > 0) {
      this._ordenService.validarOV(this.orden4, "VALIDATE").subscribe(
        response => {
          if (response.tt_out_ordenventaRow.length) {
            this.orden4Response = response.tt_out_ordenventaRow;
          }
          else {
            this.orden4Response.push(response.tt_out_ordenventaRow);
          }
          if (this.orden4Response.length < 1) {
            this.orden4Response.push('nodata');
          }
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        },
        error => {
          this.orden4Response.push('nodata');
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        }
      );
    }
    else {
      this.orden4Response.push('nodata');
      if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
        this.siguienteValidacion();
      }
    }
    //Valida Semana 5
    if (this.orden5.length > 0) {
      this._ordenService.validarOV(this.orden5, "VALIDATE").subscribe(
        response => {
          if (response.tt_out_ordenventaRow.length) {
            this.orden5Response = response.tt_out_ordenventaRow;
          }
          else {
            this.orden5Response.push(response.tt_out_ordenventaRow);
          }
          if (this.orden5Response.length < 1) {
            this.orden5Response.push('nodata');
          }
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        },
        error => {
          this.orden5Response.push('nodata');
          if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
            this.siguienteValidacion();
          }
        }
      );
    }
    else {
      this.orden5Response.push('nodata');
      if (this.orden1Response.length > 0 && this.orden2Response.length > 0 && this.orden3Response.length > 0 && this.orden4Response.length > 0 && this.orden5Response.length > 0) {
        this.siguienteValidacion();
      }
    }
  }

  siguienteValidacion() {
    //Integrar Semana 1
    if (this.orden1Response[0] != 'nodata') {
      for (let i = 0; i < this.orden1.length; i++) {
        for (let x = 0; x < this.orden1Response.length; x++) {
          if (this.orden1[i].parte.codigo_int == this.orden1Response[x].tt_out_articulo && this.orden1[i].cantidad == this.orden1Response[x].tt_out_cant && this.orden1[i].id == this.orden1Response[x].tt_out_indice && this.orden1[i].semana == this.orden1Response[x].tt_out_semana) {
            this.orden1[i].errorcode = this.orden1Response[x].tt_out_status;
            this.orden1[i].errordescripcion = this.orden1Response[x].tt_out_status_desc;
          }
        }
      }
    }

    //Integrar Semana 2
    if (this.orden2Response[0] != 'nodata') {
      for (let i = 0; i < this.orden2.length; i++) {
        for (let x = 0; x < this.orden2Response.length; x++) {
          if (this.orden2[i].parte.codigo_int == this.orden2Response[x].tt_out_articulo && this.orden2[i].cantidad == this.orden2Response[x].tt_out_cant && this.orden2[i].id == this.orden2Response[x].tt_out_indice && this.orden2[i].semana == this.orden2Response[x].tt_out_semana) {
            this.orden2[i].errorcode = this.orden2Response[x].tt_out_status;
            this.orden2[i].errordescripcion = this.orden2Response[x].tt_out_status_desc;
          }
        }
      }
    }

    //Integrar Semana 3
    if (this.orden3Response[0] != 'nodata') {
      for (let i = 0; i < this.orden3.length; i++) {
        for (let x = 0; x < this.orden3Response.length; x++) {
          if (this.orden3[i].parte.codigo_int == this.orden3Response[x].tt_out_articulo && this.orden3[i].cantidad == this.orden3Response[x].tt_out_cant && this.orden3[i].id == this.orden3Response[x].tt_out_indice && this.orden3[i].semana == this.orden3Response[x].tt_out_semana) {
            this.orden3[i].errorcode = this.orden3Response[x].tt_out_status;
            this.orden3[i].errordescripcion = this.orden3Response[x].tt_out_status_desc;
          }
        }
      }
    }

    //Integrar Semana 4
    if (this.orden4Response[0] != 'nodata') {
      for (let i = 0; i < this.orden4.length; i++) {
        for (let x = 0; x < this.orden4Response.length; x++) {
          if (this.orden4[i].parte.codigo_int == this.orden4Response[x].tt_out_articulo && this.orden4[i].cantidad == this.orden4Response[x].tt_out_cant && this.orden4[i].id == this.orden4Response[x].tt_out_indice && this.orden4[i].semana == this.orden4Response[x].tt_out_semana) {
            this.orden4[i].errorcode = this.orden4Response[x].tt_out_status;
            this.orden4[i].errordescripcion = this.orden4Response[x].tt_out_status_desc;
          }
        }
      }
    }

    //Integrar Semana 5
    if (this.orden5Response[0] != 'nodata') {
      for (let i = 0; i < this.orden5.length; i++) {
        for (let x = 0; x < this.orden5Response.length; x++) {
          if (this.orden5[i].parte.codigo_int == this.orden5Response[x].tt_out_articulo && this.orden5[i].cantidad == this.orden5Response[x].tt_out_cant && this.orden5[i].id == this.orden5Response[x].tt_out_indice && this.orden5[i].semana == this.orden5Response[x].tt_out_semana) {
            this.orden5[i].errorcode = this.orden5Response[x].tt_out_status;
            this.orden5[i].errordescripcion = this.orden5Response[x].tt_out_status_desc;
          }
        }
      }
    }

    //Mandar a llamar la Segunda Validacion
    this._ordenService.validaOV(this.orden1, this.orden2, this.orden3, this.orden4).subscribe(
      response => {
        this.cargando = !this.cargando;
        let response1 = new Array<any>();
        let response2 = new Array<any>();
        let response3 = new Array<any>();
        let response4 = new Array<any>();
        //Normalizar SEMANA 1
        if (Array.isArray(response.tt_out_semana1.tt_out_semana1Row)) {
          response1 = response.tt_out_semana1.tt_out_semana1Row;
        }
        else {
          response1.push(response.tt_out_semana1.tt_out_semana1Row);
        }
        //Normalizar SEMANA 2
        if (Array.isArray(response.tt_out_semana2.tt_out_semana2Row)) {
          response2 = response.tt_out_semana2.tt_out_semana2Row;
        }
        else {
          response2.push(response.tt_out_semana2.tt_out_semana2Row);
        }
        //Normalizar SEMANA 3
        if (Array.isArray(response.tt_out_semana3.tt_out_semana3Row)) {
          response3 = response.tt_out_semana3.tt_out_semana3Row;
        }
        else {
          response3.push(response.tt_out_semana3.tt_out_semana3Row);
        }
        //Normalizar SEMANA 4
        if (Array.isArray(response.tt_out_semana4.tt_out_semana4Row)) {
          response4 = response.tt_out_semana4.tt_out_semana4Row;
        }
        else {
          response4.push(response.tt_out_semana4.tt_out_semana4Row);
        }

        let res1 = true;
        let res2 = true;
        let res3 = true;
        let res4 = true;
        if(this.orden1.length > 0){
          res1 = false;
        }
        if(this.orden2.length > 0){
          res2 = false;
        }
        if(this.orden3.length > 0){
          res3 = false;
        }
        if(this.orden4.length > 0){
          res4 = false;
        }
        //Integrar Validacion Semana 1
        for (let i = 0; i < this.orden1.length; i++) {
          if (this.orden1[i].errordescripcion == "") {
            //Seccion para Revisar la configuracion de la Parte
            let partes = new Array<any>();
            partes.push(this.orden1[i].parte);
            this._configuracionService.obtenerConfiguracionParte(partes).subscribe(
              response => {
                if(response.partes.partesRow.activated == 0){
                  this.orden1[i].errorcode = response1[i].tt_out_status;
                  this.orden1[i].errordescripcion = response1[i].tt_out_status_desc;
                }
                else{
                  this.orden1[i].errorcode = 200;
                  this.orden1[i].errordescripcion = "	OV's OK";
                }
                //Esperamos a que terminen todos los meses.
                res1 = true;
                if(res1 && res2 && res3 && res4){
                  if (this.aprobada) {
                    this.validado = true;
                    this.autorizacion = false;
                  }
                  else {
                    this.liberaValidacion();
                  }
                }
              },
              error => {
                console.error("Ocurrio un error al obtener la configuracion de la parte");
                this.orden1[i].errorcode = response1[i].tt_out_status;
                this.orden1[i].errordescripcion = response1[i].tt_out_status_desc;
              }
            );
          }
        }
        //Integrar Validacion Semana 2
        for (let i = 0; i < this.orden2.length; i++) {
          if (this.orden2[i].errordescripcion == "") {
            //Seccion para Revisar la configuracion de la Parte
            let partes = new Array<any>();
            partes.push(this.orden2[i].parte);
            this._configuracionService.obtenerConfiguracionParte(partes).subscribe(
              response => {
                if(response.partes.partesRow.activated == 0){
                  this.orden2[i].errorcode = response2[i].tt_out_status;
                  this.orden2[i].errordescripcion = response2[i].tt_out_status_desc;
                }
                else{
                  this.orden2[i].errorcode = 200;
                  this.orden2[i].errordescripcion = "	OV's OK";
                }
                //Esperamos a que terminen todos los meses.
                res2 = true;
                if(res1 && res2 && res3 && res4){
                  if (this.aprobada) {
                    this.validado = true;
                    this.autorizacion = false;
                  }
                  else {
                    this.liberaValidacion();
                  }
                }
              },
              error => {
                console.error("Ocurrio un error al obtener la configuracion de la parte");
                this.orden2[i].errorcode = response2[i].tt_out_status;
                this.orden2[i].errordescripcion = response2[i].tt_out_status_desc;
              }
            );
          }
        }
        //Integrar Validacion Semana 3
        for (let i = 0; i < this.orden3.length; i++) {
          if (this.orden3[i].errordescripcion == "") {
            //Seccion para Revisar la configuracion de la Parte
            let partes = new Array<any>();
            partes.push(this.orden3[i].parte);
            this._configuracionService.obtenerConfiguracionParte(partes).subscribe(
              response => {
                if(response.partes.partesRow.activated == 0){
                  this.orden3[i].errorcode = response3[i].tt_out_status;
                  this.orden3[i].errordescripcion = response3[i].tt_out_status_desc;
                }else{
                  this.orden3[i].errorcode = 200;
                  this.orden3[i].errordescripcion = "	OV's OK";
                }
                //Esperamos a que terminen todos los meses.
                res3 = true;
                if(res1 && res2 && res3 && res4){
                  if (this.aprobada) {
                    this.validado = true;
                    this.autorizacion = false;
                  }
                  else {
                    this.liberaValidacion();
                  }
                }
              },
              error => {
                console.error("Ocurrio un error al obtener la configuracion de la parte");
                this.orden3[i].errorcode = response3[i].tt_out_status;
                this.orden3[i].errordescripcion = response3[i].tt_out_status_desc;
              }
            );
          }
        }
        //Integrar Validacion Semana 4
        for (let i = 0; i < this.orden4.length; i++) {
          if (this.orden4[i].errordescripcion == "") {
            //Seccion para Revisar la configuracion de la Parte
            let partes = new Array<any>();
            partes.push(this.orden4[i].parte);
            this._configuracionService.obtenerConfiguracionParte(partes).subscribe(
              response => {
                if(response.partes.partesRow.activated == 0){
                  this.orden4[i].errorcode = response4[i].tt_out_status;
                  this.orden4[i].errordescripcion = response4[i].tt_out_status_desc;
                }else{
                  this.orden4[i].errorcode = 200;
                  this.orden4[i].errordescripcion = "	OV's OK";
                }
                //Esperamos a que terminen todos los meses.
                res4 = true;
                if(res1 && res2 && res3 && res4){
                  if (this.aprobada) {
                    this.validado = true;
                    this.autorizacion = false;
                  }
                  else {
                    this.liberaValidacion();
                  }
                }
              },
              error => {
                console.error("Ocurrio un error al obtener la configuracion de la parte");
                this.orden4[i].errorcode = response4[i].tt_out_status;
                this.orden4[i].errordescripcion = response4[i].tt_out_status_desc;
              }
            );
          }
        }

        
      },
      error => {
        console.error("Error al Validar OVs");
      }
    );
  }

  liberaValidacion() {
    console.log("Entro");
    this.validado = true;
    this.autorizacion = false;
    //Valida Semana 1
    for (let i = 0; i < this.orden1.length; i++) {
      if (this.orden1[i].errorcode != 200) {
        if (this.orden1[i].errorcode >= 400) {
          this.autorizacion = true;
        }
        else {
          this.autorizacion = false;
          this.validado = false;
        }
      }
    }

    //Valida Semana 2
    for (let i = 0; i < this.orden2.length; i++) {
      if (this.orden2[i].errorcode != 200) {
        if (this.orden2[i].errorcode >= 400) {
          this.autorizacion = true;
        }
        else {
          this.autorizacion = false;
          this.validado = false;
        }
      }
    }

    //Valida Semana 3
    for (let i = 0; i < this.orden3.length; i++) {
      if (this.orden3[i].errorcode != 200) {
        if (this.orden3[i].errorcode >= 400) {
          this.autorizacion = true;
        }
        else {
          this.autorizacion = false;
          this.validado = false;
        }
      }
    }

    //Valida Semana 4
    for (let i = 0; i < this.orden4.length; i++) {
      if (this.orden4[i].errorcode != 200) {
        if (this.orden4[i].errorcode >= 400) {
          this.autorizacion = true;
        }
        else {
          this.autorizacion = false;
          this.validado = false;
        }
      }
    }

    //Valida Semana 5
    for (let i = 0; i < this.orden5.length; i++) {
      if (this.orden5[i].errorcode != 200) {
        if (this.orden5[i].errorcode >= 400) {
          this.autorizacion = true;
        }
        else {
          this.autorizacion = false;
          this.validado = false;
        }
      }
    }

    if (this.autorizacion) {
      this.buttonText = "SOLICITAR AUTORIZACION";
    }
    else {
      this.buttonText = "GENERAR OV";
    }

  }


  semana1(orden: OrdenVenta[]) {
    this.validado = false;
    this.orden1 = orden;
  }

  semana2(orden: OrdenVenta[]) {
    this.validado = false;
    this.orden2 = orden;
  }

  semana3(orden: OrdenVenta[]) {
    this.validado = false;
    this.orden3 = orden;
  }

  semana4(orden: OrdenVenta[]) {
    this.validado = false;
    this.orden4 = orden;
  }

  semana5(orden: OrdenVenta[]) {
    this.validado = false;
    this.orden5 = orden;
  }


  validasemana1(): boolean {
    let bandera = false;

    if (this.orden1.length > 0) {
      for (var i = 0; i < this.orden1.length; i++) {
        //Valida la entrega en la Primera Semana
        if (this.orden2) {
          for (var a = 0; a < this.orden2.length; a++) {
            if (this.orden1[i].parte.codigo_int == this.orden2[a].parte.codigo_int) {
              bandera = true;
            }
          }
        }

        //Valida entrega en la segunda Semana
        if (this.orden3) {
          for (var b = 0; b < this.orden3.length; b++) {
            if (this.orden1[i].parte.codigo_int == this.orden3[b].parte.codigo_int) {
              bandera = true;
            }
          }
        }

        //Valida entrega en la Tercera Semana
        if (this.orden4) {
          for (var c = 0; c < this.orden4.length; c++) {
            if (this.orden1[i].parte.codigo_int == this.orden4[c].parte.codigo_int) {
              bandera = true;
            }
          }
        }

      }
    }

    return bandera;
  }

  validasemana2(): boolean {
    let bandera = false;
    if (this.orden2) {
      for (var i = 0; i < this.orden2.length; i++) {

        //Valida entrega en la segunda Semana
        if (this.orden3) {
          for (var b = 0; b < this.orden3.length; b++) {
            if (this.orden2[i].parte.codigo_int == this.orden3[b].parte.codigo_int) {
              bandera = true;
            }
          }
        }

        //Valida entrega en la Tercera Semana
        if (this.orden4) {
          for (var c = 0; c < this.orden4.length; c++) {
            if (this.orden2[i].parte.codigo_int == this.orden4[c].parte.codigo_int) {
              bandera = true;
            }
          }
        }

      }
    }

    return bandera;
  }

  validasemana3(): boolean {
    let bandera = false;
    if (this.orden3) {
      for (var i = 0; i < this.orden3.length; i++) {
        if (this.orden4) {
          for (var c = 0; c < this.orden4.length; c++) {
            if (this.orden3[i].parte.codigo_int == this.orden4[c].parte.codigo_int) {
              bandera = true;
            }
          }
        }
      }
    }
    return bandera;
  }

  limpiar() {
    this.generar = !this.generar;

    this.cliente = new Cliente('', '');
    this.embarcar = new Embarcar('', '');
    this.tipoVenta = "";
    this.almacen = "";
    this.generar = false;
    this.cargando = false;
    this.pronosticoMensual = 0;
    this.ovMensual = 0;
    this.totalRegistros = 0;
    this.validado = false;
    this.autorizacion = false;
    this.folio = "Nuevo";

    this.orden1 = new Array<OrdenVenta>();
    this.orden2 = new Array<OrdenVenta>();
    this.orden3 = new Array<OrdenVenta>();
    this.orden4 = new Array<OrdenVenta>();
    this.orden5 = new Array<OrdenVenta>();

    this.orden1Response = new Array<any>();
    this.orden2Response = new Array<any>();
    this.orden3Response = new Array<any>();
    this.orden4Response = new Array<any>();
    this.orden5Response = new Array<any>();
  }
}
