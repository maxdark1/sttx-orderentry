import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import  {UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [UserService]
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor( public location: Location, private router: Router, private _userService: UserService) {}

  ngOnInit() {

   /* let user = JSON.parse(localStorage.getItem('sesion'));
     this._userService.checksession(user).subscribe(
       response => {
          if(response)
          {
            const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
            if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
                document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
            } else {
                document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
            }
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.location.subscribe((ev:PopStateEvent) => {
                this.lastPoppedUrl = ev.url;
            });
             this.router.events.subscribe((event:any) => {
                if (event instanceof NavigationStart) {
                   if (event.url != this.lastPoppedUrl)
                       this.yScrollStack.push(window.scrollY);
               } else if (event instanceof NavigationEnd) {
                   if (event.url == this.lastPoppedUrl) {
                       this.lastPoppedUrl = undefined;
                       window.scrollTo(0, this.yScrollStack.pop());
                   } else
                       window.scrollTo(0, 0);
               }
            });
            this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
                 elemMainPanel.scrollTop = 0;
                 elemSidebar.scrollTop = 0;
            });
            if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
                let ps = new PerfectScrollbar(elemMainPanel);
                ps = new PerfectScrollbar(elemSidebar);
            }
          }
          else
          {
            let url = document.URL.split(':')[1];
            url += "/web-sttx";
            window.location.replace(url);
          }
       },
       error => {
        console.log(error);
       }
     );  */
  }
  ngAfterViewInit() {
     /* this.runOnRouteChange();*/
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  obtenerAmbiente(){
    let path = "http://" + window.location.host.split(':')[0] + '/web-sttx/principal.html';
    return path;
  }

}
