import { Routes } from '@angular/router';

import { IconsComponent } from '../../icons/icons.component';
import { nopathComponent } from '../../nopath/nopath.component';
import { PreorderComponent } from '../../pages/preorder/preorder.component';
import { PreorderAuthComponent } from '../../pages/preorder-auth/preorder-auth.component';
import { PreorderListComponent } from '../../pages/preorder-list/preorder-list.component';
import { DeactivateComponent } from '../../pages/deactivate/deactivate.component';
import { ReporteComponent } from '../../pages/reporte/reporte.component';
import { SolicitudVendedorComponent } from '../../pages/solicitud-vendedor/solicitud-vendedor.component';
import { AutorizacionCambioComponent } from '../../pages/autorizacion-cambio/autorizacion-cambio.component';
import { FrmVendedorComponent } from '../../pages/solicitud-vendedor/frm-vendedor/frm-vendedor.component';

//Guards
import {PermisoGuard} from '../../guards/permiso.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'other', component: IconsComponent, canActivate:[PermisoGuard]},
    { path: 'preorder', component: PreorderComponent /*canActivate:[PermisoGuard] Ruta Angular */},
    { path: 'preorder-auth', component: PreorderAuthComponent, canActivate: [PermisoGuard]},
    { path: 'preorder-list', component: PreorderListComponent, canActivate: [PermisoGuard]},
    { path: 'deactivate', component: DeactivateComponent, canActivate: [PermisoGuard]},
    { path: 'reporte', component: ReporteComponent, canActivate: [PermisoGuard] },
    { path: 'solicitud-cambio', component: SolicitudVendedorComponent,/* canActivate: [PermisoGuard] */},
    { path: 'aprobacion-cambio', component: AutorizacionCambioComponent, /*canActivate: [PermisoGuard] */},
    { path: 'frm-vendedor', component: FrmVendedorComponent,/* canActivate: [PermisoGuard] */},
    { path: '**', component: nopathComponent }, 
];
