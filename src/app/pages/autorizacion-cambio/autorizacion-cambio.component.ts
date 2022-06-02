import { Component, OnInit } from '@angular/core';
import { Cliente } from 'app/models/cliente.model';
import { Embarcar } from 'app/models/embarcar.model';
import { Vendedor } from 'app/models/vendedor.model';
import { ThousandsPipe } from 'app/pipes/ThousandsPipe';
import { firstValueFrom } from 'rxjs';
import swal from 'sweetalert2';

// Servicios
import { VendedorService } from '../../services/vendedor.service';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
    selector: 'app-autorizacion-cambio',
    templateUrl: './autorizacion-cambio.component.html',
    styleUrls: ['./autorizacion-cambio.component.css'],
    providers: [VendedorService, NotificacionService]
})
export class AutorizacionCambioComponent implements OnInit {

    public cargando = false;
    public pendientes: Array<any> = new Array<any>();
    public nuevo_inside: Vendedor = new Vendedor('','');
    public nuevo_vendedor: Vendedor = new Vendedor('','');
    public nuevo_subdir: Vendedor = new Vendedor('','');
    public viejo_inside: Vendedor = new Vendedor('','');
    public viejo_vendedor: Vendedor = new Vendedor('','');
    public viejo_subdir: Vendedor = new Vendedor('','');
    public cliente: Cliente = new Cliente('','');
    public embarcar: Embarcar = new Embarcar('','');
    public folio = 0;
    public usuario = '';

    constructor(private _vendedor: VendedorService, private _notificacion: NotificacionService) { }

    ngOnInit(): void {
        this.obtenerPendientes();
    }

    obtenerPendientes(){
        this.pendientes = new Array<any>();
        this._vendedor.obtenerListaPendientes(0,0).subscribe({
            next : (response) => {
                if(response.oCode == 200){
                    // Codigo cuando existen Ordenes incompletas
                    if(response.ttSalesreq.ttSalesreqRow.length){
                        this.pendientes = response.ttSalesreq.ttSalesreqRow;
                    } else{
                        this.pendientes.push(response.ttSalesreq.ttSalesreqRow);
                    }
                }
            },
            error: (e) => {
                console.error('Ocurrio un error al Consumir el Web Service [wsgetspreq] ' + e);
                swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsgetspreq]', 'error');
            }
        });

    }

    public async cargarVista(dataItem) {
        this.folio = dataItem['tt-folio'];
        this.usuario = dataItem['tt-usuario'];
        this.nuevo_inside = new Vendedor(dataItem['tt-inside'],dataItem['tt-inside-desc']);
        this.nuevo_vendedor = new Vendedor(dataItem['tt-vendedor'],dataItem['tt-vendedor-desc']);
        this.nuevo_subdir = new Vendedor(dataItem['tt-subdir'],dataItem['tt-subdir-desc']);

        this.cliente = new Cliente(dataItem['tt-cliente'],dataItem['tt-cliente-desc']);
        this.embarcar = new Embarcar(dataItem['tt-embarcar'],dataItem['tt-embarcar-desc']);

        const vendedoresViejos: Array<any> = await this.cargarAnteriores(this.cliente,this.embarcar);

        const tmpInside = vendedoresViejos.find(vendedor => vendedor['tt-tipo'] === 'inside');
        const tmpVend = vendedoresViejos.find(vendedor => vendedor['tt-tipo'] === 'vendedor');
        const tmpSubdir = vendedoresViejos.find(vendedor => vendedor['tt-tipo'] === 'subdir');

        this.viejo_inside = new Vendedor(tmpInside['tt-codigo'],tmpInside['tt-vendedor']);
        this.viejo_vendedor = new Vendedor(tmpVend['tt-codigo'],tmpVend['tt-vendedor']);
        this.viejo_subdir = new Vendedor(tmpSubdir['tt-codigo'],tmpSubdir['tt-vendedor']);


    }

    cargarAnteriores = async (cliente: Cliente, embarcar: Embarcar): Promise<any>=> {
        const response = await firstValueFrom(this._vendedor.obtenerVendedores(cliente,embarcar));
        return response.ttVendedores.ttVendedoresRow;
    }

    aprobarSolicitud = async () => {
        const response = await firstValueFrom(this._vendedor.aprobarSolicitud(this.cliente,this.embarcar,this.nuevo_inside,this.nuevo_vendedor,this.nuevo_subdir,this.folio));
        if(response.oCode === 200){
            swal.fire('OK!', 'Datos Guardados con Exito', 'success');
            this.obtenerPendientes();
            this.notificarAutorizacion();
        } else {
            console.error('Ocurrio un error al Consumir el Web Service [wssetsp]');
            swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wssetsp]', 'error');
        }
    }

    rechazarSolicitud = async () => {

        const response = await firstValueFrom(this._vendedor.rechazarSolicitud(this.folio));
        if(response.oCodigo === 200){
            swal.fire('OK!', 'Datos Guardados con Exito', 'success');
            this.obtenerPendientes();
            this.notificarRechazo();
        }else {
            console.error('Ocurrio un error al Consumir el Web Service [wsrejectreq]');
            swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsrejectreq]', 'error');
        }

    }

    notificarAutorizacion = async () => {

        try{
            const correo = await firstValueFrom(this._notificacion.obtenerCorreoxUsuario(this.usuario));
            await firstValueFrom(this._notificacion.enviarCorreo(correo.mail,'Solicitud Cambio de Vendedor Aprobada','Cambio de Vendedor <h3 style=\'color:green\'>Aprobado</h3> para el Cliente: ' + this.cliente.nombre + ' Y embarcar a: ' + this.embarcar.descripcion,'Para mas detalle puede validar la informacion de este correo en sistema'));
        } catch(e) {
            console.error('Ocurrio un error al Consumir el Web Service [wsnotaprob]', e);
            swal.fire('Ups!', 'Ocurrio un error al Consumir el Web Service [wsnotaprob]', 'error');
        }

    }

    notificarRechazo = async () => {
        const correo = await firstValueFrom(this._notificacion.obtenerCorreoxUsuario(this.usuario));
        await firstValueFrom(this._notificacion.enviarCorreo(correo.mail,'Solicitud Cambio de Vendedor Rechazada','Cambio de Vendedor <h3 style=\'color:red\'>Rechazado</h3> para el Cliente: ' + this.cliente.nombre + ' Y embarcar a: ' + this.embarcar.descripcion,'Para conocer los detalles del rechazo favor de hablar con el encargado del proceso'));
    }

}
