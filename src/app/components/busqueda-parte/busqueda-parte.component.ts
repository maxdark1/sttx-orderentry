//Bibliotecas
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

//Servicios
import { ParteService } from '../../services/parte.service';

//Modelos
import { Cliente } from '../../models/cliente.model';
import { Embarcar } from '../../models/embarcar.model';
import { Parte } from '../../models/parte.model';

//Dependencias de Kendo
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-busqueda-parte',
  templateUrl: './busqueda-parte.component.html',
  styleUrls: ['./busqueda-parte.component.css'],
  providers: [ParteService]
})
export class BusquedaParteComponent implements OnInit {

  //Inputs
  @Input() cliente: Cliente;
  @Input() embarcar: Embarcar;
  @Input() tipoVenta: String;
  @Input() instancia: Number;
  @Input() aprobada: boolean = false;

  //Outputs
  @Output() parte: EventEmitter<Parte>;

  //Variables Locales
  public partes: Parte[];
  public filtro: String = "";
  public gridData: GridDataResult;
  public state: State;
  public pageSize = 10;
  public skip = 0;

  constructor(private _parteService: ParteService) {
    this.parte = new EventEmitter();
  }

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
  }

  public obtenerPartes() {
    this.filtro = "";
    this._parteService.obtenerPartes(this.cliente, this.embarcar).subscribe(
      response => {
        //Limpia el arreglo
        this.partes = new Array<Parte>();
        if (response.ttpartesRow) {
          //Llena la propiedad que utilizaremos para generar el dataSource del Grid.
          for (var i = 0; i < response.ttpartesRow.length; i++) {
            let parte = new Parte(
              response.ttpartesRow[i].codigo_int,
              response.ttpartesRow[i].codigo_cliente,
              response.ttpartesRow[i].cliente,
              response.ttpartesRow[i].embarcar,
              response.ttpartesRow[i].um_inventario,
              response.ttpartesRow[i].um_facturacion,
              response.ttpartesRow[i].linea_producto,
              response.ttpartesRow[i].estado,
              response.ttpartesRow[i].acabados,
              response.ttpartesRow[i].pintado,
              response.ttpartesRow[i].dimension,
              response.ttpartesRow[i].grado,
              response.ttpartesRow[i].tipoVenta,
              response.ttpartesRow[i].almacen);
            if (parte.tipoVenta == this.tipoVenta) {
              this.partes.push(parte);
            }
          }
          this.loadItems();
        }
        else {
          //Limpia el arreglo
          this.partes = new Array<Parte>();
          swal.fire("Sin Datos", "No se encontraron Partes para el Cliente:" + this.cliente.nombre + " con embarcar a:" + this.embarcar.descripcion, "error");
        }
      },
      error => {
        console.error("Hubo un problema de comunicacion con el WebService" + error);
      }
    )
  }

  public agregarParte(parte: Parte) {
    this.parte.emit(parte);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  loadItems(): void {
    this.gridData = {
      data: this.partes.slice(this.skip, this.skip + this.pageSize),
      total: this.partes.length
    };
  }

}
