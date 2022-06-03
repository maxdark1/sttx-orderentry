import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

//Material UI Imports
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';

//Componentes
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';
import { BusquedaEmbarcarComponent } from './busqueda-embarcar/busqueda-embarcar.component';
import { BusquedaParteComponent } from './busqueda-parte/busqueda-parte.component';
import { BusquedaVendedorComponent } from './busqueda-vendedor/busqueda-vendedor.component';

//KENDO
//Kendo UI Module
import { GridModule, ExcelModule  } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    GridModule,
    ExcelModule,
    DropDownsModule,
    FormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    BusquedaClienteComponent,
    BusquedaEmbarcarComponent,
    BusquedaParteComponent,
    BusquedaVendedorComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    BusquedaClienteComponent,
    BusquedaEmbarcarComponent,
    BusquedaParteComponent,
    BusquedaVendedorComponent,
  ]
})
export class ComponentsModule { }
