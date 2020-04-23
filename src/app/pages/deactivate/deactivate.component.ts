//Bibliotecas
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

//Modelos
import { Cliente } from '../../models/cliente.model';
import { Embarcar } from 'app/models/embarcar.model';
import { Parte } from '../../models/parte.model';

//Servicios
import { ParteService } from '../../services/parte.service';
import { configuracionService } from '../../services/configuracion.service';

//Dependencias de Kendo
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-deactivate',
  templateUrl: './deactivate.component.html',
  styleUrls: ['./deactivate.component.css'],
  providers: [ParteService, configuracionService]
})
export class DeactivateComponent implements OnInit {

  constructor(private _ParteService : ParteService, private _ConfiguracionService: configuracionService) { 

  }

  public cliente: Cliente = new Cliente('', '');
  public embarcar: Embarcar = new Embarcar('', '');
  public partes : any[] = new Array<any>();
  public filtro: String = "";
  public state: State;
  public gridData: GridDataResult;
  public skip = 0;
  public visible = true;


  ngOnInit() {
    this.state = {
      skip: 0,
      // Descripcion del Filtro
      filter: {
        logic: 'or',
        filters: [
          { field: 'codigo_int', operator: 'contains', value: this.filtro },
          { field: 'codigo_cliente', operator: 'contains', value: this.filtro}
        ]
      }
    };
  }

  public filtrar() {
    this.state.filter.filters[0]["value"] = this.filtro;
    this.state.filter.filters[1]["value"] = this.filtro;
    this.gridData = process(this.partes, this.state);
    if(this.filtro == ""){
      this.visible = true;
    }
    else{
      this.visible = false;
    }
  }

  loadItems(): void {
    this.gridData = {
      data: this.partes,
      total: this.partes.length
    };
  }

  obtenerCliente(cliente: Cliente) {
    this.partes = new Array<any>();
    this.cliente = cliente;
    this._ParteService.obtenerPartes(this.cliente,this.embarcar).subscribe(
      response => {
        for(let i =0; i < response.ttpartesRow.length; i++)
        {
          let parte = {
            codigo_int: response.ttpartesRow[i].codigo_int,
            codigo_cliente: response.ttpartesRow[i].codigo_cliente,
            activo: false
          };
          this.partes.push(parte);
        }

        this._ConfiguracionService.obtenerConfiguracionParte(this.partes).subscribe(
          response => {
            for(let i=0; i < this.partes.length; i++){
              for(let x=0; x < response.partes.partesRow.length; x++){
                if(this.partes[i].codigo_int == response.partes.partesRow[x].parte){
                  this.partes[i].activo = response.partes.partesRow[x].activated
                }
              }
            }
           this.loadItems(); 
          },
          error => {
            console.error(error);
          }
        );

      },
      error => {
        console.error(error);
      });
  }

  obtenerEmbarcar(embarcar: Embarcar) {
    this.partes = new Array<any>();
    this.embarcar = embarcar;
    this._ParteService.obtenerPartes(this.cliente,this.embarcar).subscribe(
      response => {
        for(let i =0; i < response.ttpartesRow.length; i++)
        {
          let parte = {
            codigo_int: response.ttpartesRow[i].codigo_int,
            codigo_cliente: response.ttpartesRow[i].codigo_cliente,
            activo: false
          };
          this.partes.push(parte);
        }

        this._ConfiguracionService.obtenerConfiguracionParte(this.partes).subscribe(
          response => {
            for(let i=0; i < this.partes.length; i++){
              for(let x=0; x < response.partes.partesRow.length; x++){
                if(this.partes[i].codigo_int == response.partes.partesRow[x].parte){
                  this.partes[i].activo = response.partes.partesRow[x].activated
                }
              }
            }
            this.loadItems();
          },
          error => {
            console.error(error);
          }
        );

      },
      error => {
        console.error(error);
      });
  }

  marcarTodo(){
    for(let i=0; i < this.partes.length; i++)
    {
      this.partes[i].activo = true;
    }
  }

  desmarcarTodo(){
    for(let i=0; i < this.partes.length; i++)
    {
      this.partes[i].activo = false;
    }
  }

  guardar(){
    this._ConfiguracionService.guardarConfiguracionParte(this.partes).subscribe(
      response => {
        if(response.ocode == 200)
        {
          swal.fire('OK','Datos guardados con exito','success');
        }
        else{
          swal.fire('Ups',response.odesc,'warning');
        }
      },
      error => {
        swal.fire('Ups','Ocurrio un error favor de notificar al departamento de TI','error');
        console.error(error);
      }
    );
  }

}
