import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

//Modulos
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {ComponentsModule} from '../../components/components.module';

// Componentes
import { IconsComponent } from '../../icons/icons.component';
import { nopathComponent } from '../../nopath/nopath.component';
import { PreorderComponent } from '../../pages/preorder/preorder.component';
import { GridpartesComponent } from '../../pages/preorder/gridpartes/gridpartes.component';
import { PreorderAuthComponent } from '../../pages/preorder-auth/preorder-auth.component';
import { PreorderListComponent } from '../../pages/preorder-list/preorder-list.component';
import { GridpartesDiscretaComponent } from '../../pages/preorder/gridpartes-discreta/gridpartes-discreta.component';
import { DeactivateComponent } from '../../pages/deactivate/deactivate.component';
import { ReporteComponent } from '../../pages/reporte/reporte.component';
import { SolicitudVendedorComponent } from '../../pages/solicitud-vendedor/solicitud-vendedor.component';
import { AutorizacionCambioComponent } from '../../pages/autorizacion-cambio/autorizacion-cambio.component';
import { FrmVendedorComponent } from '../../pages/solicitud-vendedor/frm-vendedor/frm-vendedor.component';

//Servicios
import { AccesoService } from '../../services/acceso.service';
import { UserService } from '../../services/user.service';


//Guards
import { PermisoGuard } from '../../guards/permiso.guard';

//Kendo UI Module
import { GridModule, ExcelModule  } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

//Pipes
import { ThousandsPipe }  from '../../pipes/ThousandsPipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    GridModule,
    ExcelModule,
    DropDownsModule,
    ComponentsModule
  ],
  declarations: [
    IconsComponent,
    nopathComponent,
    PreorderComponent,
    GridpartesComponent,
    PreorderAuthComponent,
    PreorderListComponent,
    ThousandsPipe,
    GridpartesDiscretaComponent,
    DeactivateComponent,
    ReporteComponent,
    SolicitudVendedorComponent,
    AutorizacionCambioComponent,
    FrmVendedorComponent,
  ],
  providers: [
    PermisoGuard,
    AccesoService,
    UserService,
    ThousandsPipe
  ]
})

export class AdminLayoutModule {}
