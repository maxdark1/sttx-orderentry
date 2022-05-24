//Librerias
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

//Modelos
import { Vendedor } from '../models/vendedor.model';
import { Cliente } from '../models/cliente.model';
import { Embarcar } from '../models/embarcar.model';
import { User } from '../models/user.model';

//Servicios
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';


@Injectable()
export class VendedorService {
  public url: string;

  constructor(private _http: HttpClient, private _userService: UserService) {
    this.url = environment.apiurl;
  }

  obtenerVendedores = (cliente: Cliente, embarcar: Embarcar): Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let params = `/vendedores/vendedor.php?dominio=${user.dominio}&cliente=${cliente.cliente}&embarcar=${embarcar.codigo}`;
    //Realizar la peticion AJAX
    return this._http.get(this.url + params, { headers: headers });
  }

  obtenerCatalogoVendedores = (vendedor: Vendedor): Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let params = `/vendedores/vendedor.php?dominio=${user.dominio}&vendedor=${vendedor.codigo}`;
    //Realizar la peticion AJAX
    return this._http.get(this.url + params, { headers: headers });
  }

  obtenerListaPendientes = (folio: number, status: number): Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let params = `/vendedores/vendedor.php?dominio=${user.dominio}&folio=${folio}&status=${status}`;
    //Realizar la peticion AJAX
    return this._http.get(this.url + params, { headers: headers });
  }

  guardarSolicitud = (status: number, inside: Vendedor, vendedor: Vendedor, subdir: Vendedor, cliente: Cliente, embarcar: Embarcar): Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let API = '/vendedores/vendedor.php';
    //Enviar Parametros
    let params = new FormData();
    params.append('dominio', user.dominio);
    params.append('usuario', user.userid);
    params.append('status', status.toString());
    params.append('inside', inside.codigo);
    params.append('vendedor', vendedor.codigo);
    params.append('subdir', subdir.codigo);
    params.append('cliente', cliente.cliente);
    params.append('embarcar', embarcar.codigo);
    //Realizar la peticion AJAX
    return this._http.post(this.url + API, params, { headers: headers });
  }

  aprobarSolicitud = (cliente: Cliente, embarcar: Embarcar, inside: Vendedor, vendedor: Vendedor, subdir: Vendedor, folio : number) :  Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let API = '/vendedores/vendedor.php';
    //Enviar Parametros
    let params = new FormData();
    params.append('domain', user.dominio);
    params.append('cliente', cliente.cliente);
    params.append('embarcar', embarcar.codigo);
    params.append('inside', inside.codigo);
    params.append('vendedor', vendedor.codigo);
    params.append('subdir', cliente.cliente);
    params.append('folio',folio.toString());
    //Realizar la peticion AJAX
    return this._http.post(this.url + API, params, { headers: headers });
  }

  rechazarSolicitud = (folio: number) : Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
    let headers = new HttpHeaders();
    headers.append('Access-Control-Request-Headers', '*');
    headers.append('content-type', 'application/json');
    //Obtener Sesion de Usuario
    let user: User = this._userService.obtenerusuario();
    //Armar URL
    let API = '/vendedores/vendedor.php';
    //Enviar Parametros
    let params = new FormData();
    params.append('wsreject_dominio', user.dominio);
    params.append('wsreject_folio',folio.toString());
    //Realizar la peticion AJAX
    return this._http.post(this.url + API, params, { headers: headers });
  }

}
