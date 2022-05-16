import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

//Modelos
import { Vendedor } from '../../models/vendedor.model';

//Servicios
import { VendedorService } from '../../services/vendedor.service';

//Dependencias de Kendo
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-busqueda-vendedor',
  templateUrl: './busqueda-vendedor.component.html',
  styleUrls: ['./busqueda-vendedor.component.css'],
  providers: [VendedorService]
})
export class BusquedaVendedorComponent implements OnInit {

  @Input() vendedorSeleccionado: string = "";
  vendedores: Vendedor[] = new Array;
  @Input() instancia: Number;
  public filtro: String = "";
  public gridData: GridDataResult;
  public pageSize = 10;
  public state: State;
  public skip = 0;
  @Output() oVendedor: EventEmitter<Vendedor>;


  constructor(private _vendedorService: VendedorService) {
    this.oVendedor = new EventEmitter();
   }

  ngOnInit(): void {
    this.state = {
      skip: 0,
      // Descripcion del Filtro
      filter: {
        logic: 'or',
        filters: [
          { field: 'codigo', operator: 'contains', value: this.filtro },
          { field: 'nombre', operator: 'contains', value: this.filtro}
        ]
      }
    };
  }

  public obtenerCatalogo = () => {
    this._vendedorService.obtenerCatalogoVendedores(new Vendedor('', '')).subscribe({
      next: (response) => {
        if(response.oCode == 200){
          let { ttVendedoresRow } = response.ttVendedores;
          ttVendedoresRow.forEach(vendedor => {
            let tmp : Vendedor = new Vendedor(vendedor['tt-codigo'],vendedor['tt-vendedor']);
            this.vendedores.push(tmp);
          });
          this.loadItems();
        } else {
          swal.fire('Ups!', 'no se consiguieron datos desde el servicio [wshelpsp]', 'error');
        }
      },
      error: (e) => {
        console.error("Ocurrio un error al Consumir el Web Service [wshelpsp] " + e);
        swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wshelpsp]', 'error');
      }
    });
  }

  public filtrar() {
    this.state.filter.filters[0]["value"] = this.filtro;
    this.state.filter.filters[1]["value"] = this.filtro;
    this.gridData = process(this.vendedores, this.state);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  loadItems(): void {
    this.gridData = {
      data: this.vendedores.slice(this.skip, this.skip + this.pageSize),
      total: this.vendedores.length
    };
  }

  agregarVendedor = (vendedor: Vendedor) => {
    this.vendedorSeleccionado = vendedor.nombre;
    this.oVendedor.emit(vendedor);
  }

}
