//Bibliotecas
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//Control de Ambientes
import { environment } from '../../environments/environment';
//Servicios
import { UserService } from '../services/user.service';
//Modelos
import { User } from '../models/user.model';
import { Parte } from '../models/parte.model';


@Injectable()
export class EstadisticaService {
    public url: string;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = environment.apiurl;
    }

    obtenerEstadistica(parte:Parte, mes: number, año: number, cliente: string, fecha_promesa: Date): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/estadisticas/estadistica.php?' + "dominio=" + user.dominio + "&parte=" + parte.codigo_int + "&mes=" + mes + "&anio=" + año + "&um=" + parte.um_inventario + "&cliente=" + cliente + "&fecha_promesa=" + fecha_promesa.toISOString();
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

}