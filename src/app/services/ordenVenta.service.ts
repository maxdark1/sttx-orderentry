//Bibliotecas
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//Control de Ambientes
import { environment } from '../../environments/environment';
//Servicios
import { UserService } from '../services/user.service';
//Modelos
import { User } from '../models/user.model';
import { OrdenVenta } from '../models/ordenventa.model';
import { Parte } from '../models/parte.model';
import { Cliente } from 'app/models/cliente.model';
import { Embarcar } from '../models/embarcar.model';


@Injectable()
export class OrdenService {
    public url: string;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = environment.apiurl;
    }

    noaprobar(folio: string, aprobado: number, causa: string): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('dominio', user.dominio);
        params.append('folio', folio);
        params.append('aprobado', String(aprobado));
        params.append('causa', causa);
        params.append('usuario_aprobador', user.userid);
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    obtenerPartes(parte: Parte, fechaInicio: Date, fechaFin: Date): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('content-type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "dominio=" + user.dominio + "&parte=" + parte.codigo_int + "&fechaInicio=" + fechaInicio.toISOString() + "&fechaFin=" + fechaFin.toISOString();
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }


    validarOV(orden: OrdenVenta[], accion: string): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('dominio', user.dominio);
        params.append('user', user.userid);
        params.append('action', accion);
        params.append('ordenes', JSON.stringify(orden));
        console.log(orden);
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    obtenernoaprobados() : Observable<any>{
       //Definir Cabezeras de la peticion AJAX
       let headers = new HttpHeaders();
       headers.append('Access-Control-Request-Headers', '*');
       headers.append('content-type', 'application/json');
       //Obtener Sesion de Usuario
       let user: User = this._userService.obtenerusuario();
       //Armar URL
       let params = '/ordenventas/ordenventa.php?' + "usuarionegado=" + user.userid;
       //Realizar la peticion AJAX
       return this._http.get(this.url + params, { headers: headers });
    }

    validaOV(semana1: OrdenVenta[], semana2: OrdenVenta[], semana3: OrdenVenta[], semana4: OrdenVenta[]): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('semana1', JSON.stringify(semana1));
        params.append('semana2', JSON.stringify(semana2));
        params.append('semana3', JSON.stringify(semana3));
        params.append('semana4', JSON.stringify(semana4));
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    generarpreOrder(aprobacion: number, almacen: string, embarcar: string, cliente: Cliente, tipoVenta: string, usuario_aprobador: string, terminado: number, ordenes: OrdenVenta[]): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('dominio', user.dominio);
        params.append('user', user.userid);
        params.append('aprovada', String(aprobacion));
        params.append('almacen', almacen);
        params.append('embarcar', embarcar);
        params.append('cliente', String(cliente));
        params.append('tipoVenta', tipoVenta);
        params.append('usuario_aprobador', usuario_aprobador);
        params.append('terminado', String(terminado));
        params.append('ordenes', JSON.stringify(ordenes));
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    obtenerlistapreordenes(status: number): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "dominio=" + user.dominio + "&status=" + status;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

    obtenerdetallepreordenes(folio: number): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "dominio=" + user.dominio + "&folio=" + folio;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

    obtenerordenesincompletas(status: number): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "dominio=" + user.dominio + "&usuariolista=" + user.userid + "&estado=" + status;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

    obtenerdetallepreordenes2(folio: number): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "domain=" + user.dominio + "&folio=" + folio;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

    actualizarpreorden(folio: number, aprobada: number, usuario_aprobador: string, terminado: number, causaid: number, causa_descripcion: string, ordenes: OrdenVenta[]): Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        let aprobador: string = "";
        if(usuario_aprobador == "si")
        {
            aprobador = user.userid;
        }
        //Enviar Parametros
        let params = new FormData();
        params.append('folio', String(folio));
        params.append('aprobada', String(aprobada));
        params.append('usuario_aprobador', aprobador);
        params.append('terminado', String(terminado));
        params.append('causa', String(causaid));
        params.append('causa_desc', causa_descripcion);
        params.append('dominio', user.dominio);
        params.append('ordenes', JSON.stringify(ordenes));
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    borrarLinea(folio: number, parte: string, id: number, semana: number) : Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('folio', String(folio));
        params.append('parte', parte);
        params.append('id', String(id));
        params.append('semana', String(semana));
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    reporte(nbr,site,region,cust,sales,fecha1 : Date, fecha2 : Date,inside,embarcar) : Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('dominio', user.dominio);
        params.append('nbr', nbr);
        params.append('site', site);
        params.append('region', region);
        params.append('cust', cust);
        params.append('slspsn', sales);
        params.append('fecha', fecha1.toISOString());
        params.append('fecha2', fecha2.toISOString());
        params.append('inside', inside);
        params.append('embarcar', embarcar);
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    generarExcel(datosExcel) : Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Armar URL
        let API = '/ordenventas/ordenventa.php';
        //Enviar Parametros
        let params = new FormData();
        params.append('datosExcel', JSON.stringify(datosExcel));
        //Realizar la peticion AJAX
        return this._http.post(this.url + API, params, { headers: headers });
    }

    obtenerFiltros() : Observable<any> {
        //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers', '*');
        headers.append('Content-Type', 'application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = '/ordenventas/ordenventa.php?' + "dominio=" + user.dominio + "&usuario=" + user.userid;
        //Realizar la peticion AJAX
        return this._http.get(this.url + params, { headers: headers });
    }

}