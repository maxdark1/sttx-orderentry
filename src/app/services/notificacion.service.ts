import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable()
export class NotificacionService{
    public url : string;

    constructor(private _http: HttpClient, private _userService: UserService){
        this.url = environment.apiurl;
    }

    obtenerCorreoxUsuario(userid: string) : Observable<any> {
         //Definir Cabezeras de la peticion AJAX
         let headers = new HttpHeaders();
         headers.append('Access-Control-Request-Headers', '*');
         headers.append('Content-Type', 'application/json');
         //Obtener Sesion de Usuario
         let user: User = this._userService.obtenerusuario();
         //Armar URL
         let params = '/notificaciones/email.php?' + "userid=" + userid; 
         //Realizar la peticion AJAX
         return this._http.get(this.url + params, { headers: headers });
    }

    obtenerCorreos(id: string, ikey1:string, ikey2: string) : Observable<any>{
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/notificaciones/email.php?' + "dominio=" + user.dominio + "&id=" + id + "&ikey1=" + ikey1 + "&ikey2=" +ikey2; 
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

    enviarCorreo(mail:string,titulo:string,html:string,pie:string) : Observable<any>{
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/notificaciones/email.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('mail',mail);
        params.append('titulo',titulo);
        params.append('html',html);
        params.append('usuario',user.userid);
        params.append('pie',pie);
        params.append('link',environment.baseurl);
        //Realizar la peticion AJAX
        return this._http.post(this.url + API,params,{ headers: headers });
    }

}