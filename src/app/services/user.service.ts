import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService{
    public url : string;

    constructor(private _http: HttpClient){
        this.url = environment.apiurl;
    }

    checksession(user : User) : Observable<any>
    {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers','*');
        headers.append('content-type','application/json');
        //Armar URL
        let params = '/sessions/session.php?' + 'sid=' + user.sessionid + '&user=' + user.userid + '&dominio=' + user.dominio;
        //Realizar la peticion AJAX
        return this._http.get(this.url+params, {headers: headers});
    }

    obtenerusuario() : User
    {
        let user: User = JSON.parse(localStorage.getItem('sesion'));
        return user;
    }

}