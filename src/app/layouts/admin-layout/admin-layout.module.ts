// Modulos
import { NgModule,LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

// Componentes
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../icons/icons.component';
import { nopathComponent } from '../../nopath/nopath.component';
import { PreorderComponent } from '../../pages/preorder/preorder.component';
import { BusquedaClienteComponent } from '../../components/busqueda-cliente/busqueda-cliente.component';
import { BusquedaEmbarcarComponent } from '../../components/busqueda-embarcar/busqueda-embarcar.component';
import { GridpartesComponent } from '../../pages/preorder/gridpartes/gridpartes.component';
import { BusquedaParteComponent } from '../../components/busqueda-parte/busqueda-parte.component';
import { PreorderAuthComponent } from '../../pages/preorder-auth/preorder-auth.component';
import { PreorderListComponent } from '../../pages/preorder-list/preorder-list.component';
import { GridpartesDiscretaComponent } from '../../pages/preorder/gridpartes-discreta/gridpartes-discreta.component';
import { DeactivateComponent } from '../../pages/deactivate/deactivate.component';
import { ReporteComponent } from '../../pages/reporte/reporte.component';

//Servicios
import { AccesoService } from '../../services/acceso.service';
import { UserService } from '../../services/user.service';
import { ClienteService } from '../../services/cliente.service';

//Guards
import { PermisoGuard } from '../../guards/permiso.guard';

//Kendo UI Module
import { GridModule, ExcelModule  } from '@progress/kendo-angular-grid';
import { IntlModule } from '@progress/kendo-angular-intl';

//Pipes
import { ThousandsPipe }  from '../../pipes/ThousandsPipe';


import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    GridModule,
    ExcelModule
  ],
  declarations: [
    DashboardComponent,
    IconsComponent,
    nopathComponent,
    PreorderComponent,
    BusquedaClienteComponent,
    BusquedaEmbarcarComponent,
    GridpartesComponent,
    BusquedaParteComponent,
    PreorderAuthComponent,
    PreorderListComponent,
    ThousandsPipe,
    GridpartesDiscretaComponent,
    DeactivateComponent,
    ReporteComponent
  ],
  providers: [
    PermisoGuard,
    AccesoService,
    UserService,
    ThousandsPipe
  ]
})

export class AdminLayoutModule { }
