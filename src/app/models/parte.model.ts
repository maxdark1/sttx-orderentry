export class Parte{
    constructor(
        public codigo_int: string,
        public codigo_cliente: string,
        public cliente: string,
        public embarcar: string,
        public um_inventario: string,
        public um_facturacion: string,
        public linea_producto: string,
        public status: string,
        public acabados: string,
        public pintado: boolean,
        public dimension: string,
        public grado: string,
        public tipoVenta: string,
        public almacen: string
    ){

    }
}