import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';


@Injectable()
export class AccesoService {
    public url: string;
    public ruta: string;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = environment.apiurl;
        let url = document.URL.split(':')[2];
        if (url.indexOf("?") > 0) {
            url = url.split('?')[0];
        }
        this.ruta = ":" + url;
    }

    public asyncaccesos(user: User): Observable<boolean> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Armar URL
        let params = '/accesos/acceso.php?' + 'user=' + user.userid + '&domain=' + user.dominio;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers })
            .pipe(map(data => {
                if (data == true) {
                    return true;
                }
                else {
                    return false;
                }
            }))
    }

    public permiso(): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Obtengo el usuario
        let user = this._userService.obtenerusuario();
        //Armar URL
        let params = '/accesos/acceso.php?' + 'user=' + user.userid + '&domain=' + user.dominio + '&path=' + this.ruta;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }
}