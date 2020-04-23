export class User{
        public userid: string;
        public nombre: string;
        public email: string;
        public sessionid: string;
        public dominio: string;
    constructor(userid,nombre,email,sessionid,dominio){
        this.userid = userid;
        this.nombre = nombre;
        this.email = email;
        this.sessionid = sessionid;
        this.dominio = dominio;
    }
}