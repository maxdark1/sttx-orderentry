//Bibliotecas
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

//Servicios
import { EmbarcarService } from '../../services/embarcar.service';

//Modelos
import { Cliente } from '../../models/cliente.model';
import { Embarcar } from '../../models/embarcar.model';

//Dependencias de Kendo
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-busqueda-embarcar',
  templateUrl: './busqueda-embarcar.component.html',
  styleUrls: ['./busqueda-embarcar.component.css'],
  providers: [EmbarcarService]
})
export class BusquedaEmbarcarComponent implements OnInit {
  public cliente: Cliente;
  @Input() embarcarSeleccionado : string = "";
  @Input() public set _cliente(value: Cliente) {
    this.cliente = value;
    if (this.cliente && this.embarcarSeleccionado == "") {
      this.obtenerEmbarcar(this.cliente);
    }
  }
  public embarcars: Embarcar[];
  public filtro: string = "";
  public state: State = {
    skip: 0,
    // Descripcion del Filtro
    filter: {
      logic: 'or',
      filters: [
        { field: 'codigo', operator: 'contains', value: this.filtro },
        { field: 'descripcion', operator: 'contains', value: this.filtro }
      ]
    }
  };
  public gridData: GridDataResult;
  @Output() embarcar: EventEmitter<Embarcar>;

  constructor(private _embarcarService: EmbarcarService) {
    this.embarcar = new EventEmitter();
  }

  ngOnInit() {
  }

  obtenerEmbarcar(cliente: Cliente) {
    this._embarcarService.obtenerEmbarcars(cliente).subscribe(
      response => {
        this.embarcarSeleccionado = "";
        if (response.root.Shipto) {
          //Limpia el Arreglo.
          this.embarcars = new Array<Embarcar>();
          //Llena la propiedad que utilizaremos para generar el dataSource del Grid.
          for(var i = 0; i < response.root.Shipto.length; i++){
            let embarcar = new Embarcar(response.root.Shipto[i].Embarcar,response.root.Shipto[i].Descripcion);
            this.embarcars.push(embarcar);
          }
          this.gridData = process(this.embarcars, this.state);
        }
        else{
          this.embarcars = new Array<Embarcar>();
          this.gridData = process(this.embarcars, this.state);
          this.embarcarSeleccionado = "";
          console.log("El cliente no cuenta con Embarcar A");
        }
      },
      error => {
        console.error("Hubo un problema de comunicacion con el WebService" + error);
      }
    );
  }

 filtrar(e) {
    this.state.filter.filters[0]["value"] = this.filtro;
    this.state.filter.filters[1]["value"] = this.filtro;
    
    this.gridData = process(this.embarcars, this.state);
  }


  seleccionarEmbarcar(embarcar: Embarcar){
    this.embarcarSeleccionado = embarcar.descripcion;
    this.embarcar.emit(embarcar);
  }

}
