//Bibliotecas
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
//Control de Ambientes
import {environment} from '../../environments/environment';
//Servicios
import { UserService } from '../services/user.service';
//Modelos
import { User } from '../models/user.model';


@Injectable()
export class configuracionService{
    public url : string;

    constructor(private _http: HttpClient,private _userService:UserService){
        this.url = environment.apiurl;
    }

obtenerConfiguracion(iclave:string,isubclave:string): Observable<any>{
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers','*');
        headers.append('content-type','application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/configuraciones/configuracion.php?' + 'dominio=' + user.dominio + '&iClave=' + iclave + '&iSubclave=' + isubclave;
        //Realizar la peticion AJAX
        return this._http.get(this.url+params, {headers: headers});
}

obtenerConfiguracionWeb(iid:string): Observable<any>{
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers','*');
    headers.append('content-type','application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let params = '/configuraciones/configuracion.php?' + 'dominio=' + user.dominio + '&iid=' + iid;
    //Realizar la peticion AJAX
    return this._http.get(this.url+params, {headers: headers});
}

guardarConfiguracionParte(partes: any[]): Observable<any>{
     //Definir Cabezeras de la peticion AJAX
     let headers = new HttpHeaders();
     headers.append('Access-Control-Request-Headers', '*');
     headers.append('content-type', 'application/json');
     //Obtener Sesion de Usuario
     let user: User = this._userService.obtenerusuario();
     //Armar URL
     let API = '/configuraciones/configuracion.php';
     //Enviar Parametros
     let params = new FormData();
     params.append('partes', JSON.stringify(partes));
     //Realizar la peticion AJAX
     return this._http.post(this.url + API, params, { headers: headers });
}

obtenerConfiguracionParte(partes: any[]): Observable<any>{
   //Definir Cabezeras de la peticion AJAX
   let headers = new HttpHeaders();
   headers.append('Access-Control-Request-Headers', '*');
   headers.append('content-type', 'application/json');
   //Obtener Sesion de Usuario
   let user: User = this._userService.obtenerusuario();
   //Armar URL
   let API = '/configuraciones/configuracion.php';
   //Enviar Parametros
   let params = new FormData();
   params.append('partess', JSON.stringify(partes));
   //Realizar la peticion AJAX
   return this._http.post(this.url + API, params, { headers: headers });
}


obtenerFechaserver(): Observable<any>{
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers','*');
    headers.append('content-type','application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let params = '/configuraciones/obtenerfecha.php?' + 'dominio=' + user.dominio;
    //Realizar la peticion AJAX
    return this._http.get(this.url+params, {headers: headers});
}

}