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
  public url : string;

  constructor(private _http: HttpClient, private _userService: UserService){
      this.url = environment.apiurl;
  }

  obtenerVendedores = (cliente: Cliente, embarcar: Embarcar) : Observable<any> => {
    //Definir Cabezeras de la peticion AJAX
        let headers = new HttpHeaders();
        headers.append('Access-Control-Request-Headers','*');
        headers.append('content-type','application/json');
        //Obtener Sesion de Usuario
        let user: User = this._userService.obtenerusuario();
        //Armar URL
        let params = `/vendedores/vendedor.php?dominio=${user.dominio}&cliente=${cliente.cliente}&embarcar=${embarcar.codigo}`;
        //Realizar la peticion AJAX
        return this._http.get(this.url+params, {headers: headers});
  } 
  
}
