import { Cliente } from "./cliente.model";
import { Embarcar } from "./embarcar.model";
import { Parte } from "./parte.model";

export class OrdenVenta{
    public ov : string = '';
    public linea: number = 0;
    
    public almacen : string;
    constructor(
        public cliente : Cliente,
        public embarcar : Embarcar,
        public fechaSolicitada : Date,
        public fechaEmbarque : Date,
        public fechaPromesa : Date,
        public parte : Parte,
        public cantidad: number,
        public oc_cliente : String,
        public comentario1: String,
        public comentario2: String,
        public comentario3: String,
        public comentario4: String,
        public comentario5: String,
        public errorcode: number,
        public errordescripcion: String,
        public id : number,
        public semana : number,
        public pronostico: number
    ){

    }
}