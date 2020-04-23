import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable()
export class ClienteService{
    public url : string;

    constructor(private _http: HttpClient, private _userService: UserService){
        this.url = environment.apiurl;
    }

    obtenerClientes(cliente : Cliente) : Observable<any>{
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers','*');
        headers.append('content-type','application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/clientes/cliente.php?' + "dominio=" + user.dominio + "&cliente=" + cliente.cliente;
        //Realizar la peticion AJAX
        return this._http.get(this.url+params, {headers: headers});
    }

}