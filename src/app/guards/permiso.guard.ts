import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AccesoService } from '../services/acceso.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PermisoGuard implements CanActivate {
    constructor(private _accesoService: AccesoService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._accesoService.permiso().pipe(
            map(res => {
                if (res) {
                    return true;
                }
                else {
                    let url = document.URL.split(':')[1];
                    url += "/web-sttx/principal.html";
                    window.location.replace(url);
                    return false;
                }
            })
        )
    }
}