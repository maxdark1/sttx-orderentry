import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    //{ path: '/', title: 'Salir', icon: 'exit_to_app', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  obtenerAmbiente(){
    let path = "http://" + window.location.host.split(':')[0] + '/web-sttx/principal.html';
    return path;
  }

}
 