import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  constructor(private _userService: UserService) {

  }

  ngOnInit() {

    console.log('Conectandose a API: ' + environment.apiurl);

    let url_string;
    let url;
    let sid;
    let usuario;
    let dominio;

    try {
      url_string = document.URL.toString();
      url = new URL(url_string);
      sid = url.searchParams.get('sid');
    }
    catch{
      console.log("No se pudo obtener el session ID");
    }

    try {
      url_string = document.URL.toString();
      url = new URL(url_string);
      usuario = url.searchParams.get('user');
    } catch{
      console.log("No se pudo obtener el userID");
    }

    try {
      url_string = document.URL.toString();
      url = new URL(url_string);
      dominio = url.searchParams.get('domain');
    } catch{
      console.log("No se pudo obtener el Dominio");
    }


    if (sid != null && usuario != null && dominio != null) {
      let user = new User(usuario, '', '', sid, dominio);
      localStorage.setItem('sesion', JSON.stringify(user));
      
    }
  }

}
