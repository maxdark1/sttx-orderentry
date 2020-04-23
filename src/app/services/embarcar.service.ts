//Bibliotecas
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//Control de Ambientes
import { environment } from '../../environments/environment';
//Servicios
import { UserService } from '../services/user.service';
//Modelos
import { Embarcar } from '../models/embarcar.model';
import { User } from '../models/user.model';
import { Cliente } from '../models/cliente.model';


@Injectable()
export class EmbarcarService{
    public url : string;

    constructor(private _http: HttpClient, private _userService: UserService){
        this.url = environment.apiurl;
    }

    obtenerEmbarcars(cliente : Cliente) : Observable<any>{
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers','*');
        headers.append('content-type','application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/embarcars/embarcar.php?' + "dominio=" + user.dominio + "&cliente=" + cliente.cliente;
        //Realizar la peticion AJAX
        return this._http.get(this.url+params, {headers: headers});
    }

}