//Bibliotecas
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import swal from'sweetalert2';

//Servicios
import { ClienteService } from '../../services/cliente.service';

//Modelos
import { Cliente } from '../../models/cliente.model';

//Dependencias de Kendo
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';




@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.css'],
  providers: [ClienteService]
})
export class BusquedaClienteComponent implements OnInit {
  public clientes: Cliente[] = new Array<Cliente>();
  public vistaGrid: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  public filtro: string = "";
  public state: State = {
    skip: 0,
    take: 5,

    // Descripcion del Filtro
    filter: {
      logic: 'or',
      filters: [
        { field: 'nombre', operator: 'contains', value: this.filtro },
        { field: 'cliente', operator: 'contains', value: this.filtro }
      ]
    }
  };
  @Output() cliente: EventEmitter<Cliente>;
  @Input() clienteSeleccionado : string = "";

  constructor(private _clienteService: ClienteService) {
    this.cliente = new EventEmitter();
  }

  ngOnInit() {
    let cliente = new Cliente("0", "uknown");
    this._clienteService.obtenerClientes(cliente).subscribe(
      response => {
        if (response.root.Clientes) {
          //Llena la propiedad que utilizaremos para generar el dataSource del Grid
          for (var i = 0; i < response.root.Clientes.length; i++) {
            let client: Cliente = new Cliente(response.root.Clientes[i].Cliente, response.root.Clientes[i].Nombre);
            this.clientes.push(client);
          }
          //Ejecuta el evento Carga Items que pagina el GRID
          this.loadItems();
        }
        else{
          this.clientes = new Array<Cliente>();
          this.loadItems();
          swal.fire('Sin Conexion con el Servidor','Favor de solicitar apoyo al equipo de TI','error');
        }
      },
      error => {
        console.error("Hubo un problema de comunicacion con el WebService" + error);
      }
    );
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  loadItems(): void {
    this.vistaGrid = {
      data: this.clientes.slice(this.skip, this.skip + this.pageSize),
      total: this.clientes.length
    };
  }

  filtrar(e) {
    this.state.filter.filters[0]["value"] = this.filtro;
    this.state.filter.filters[1]["value"] = this.filtro;
    this.vistaGrid = process(this.clientes, this.state)
    if (this.filtro == "") {
      this.loadItems();
    }
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente.nombre;
    this.cliente.emit(cliente);
  }

}
