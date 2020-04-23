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
import { Cliente } from '../models/cliente.model';
import { Embarcar } from '../models/embarcar.model';
import { Parte } from '../models/parte.model';


@Injectable()
export class ParteService {
    public url: string;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = environment.apiurl;
    }

    obtenerPartes(cliente: Cliente, embarcar: Embarcar): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = "";
        if (embarcar) {
            params = '/partes/parte.php?' + "dominio=" + user.dominio + "&cliente=" + cliente.cliente + "&embarcar=" + embarcar.codigo;
        } else {
            params = '/partes/parte.php?' + "dominio=" + user.dominio + "&cliente=" + cliente.cliente + "&embarcar=";
        }
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

}