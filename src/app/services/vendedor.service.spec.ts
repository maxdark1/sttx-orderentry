import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//Servicios
import { VendedorService } from '../services/vendedor.service';
import { UserService } from '../services/user.service';

//Modelos
import {Cliente} from '../models/cliente.model';
import {Embarcar} from '../models/embarcar.model';
import { User } from '../models/user.model';

//Ambiente
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

fdescribe('Pruebas Servicio Vendedor', () => {
    let _vendedor : VendedorService;
    let _user : UserService;
    let httpController : HttpTestingController;

    let user;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VendedorService, UserService],
            imports: [HttpClientTestingModule]
        });

        _vendedor = TestBed.inject(VendedorService);
        httpController = TestBed.inject(HttpTestingController);

        //Seteando Local Storage   
        user =  new User('jlara','Juan Lara', 'jlara@steeltechnologies.com.mx', 'ashdasdasd232423asd', 'sttx');
        localStorage.setItem('sesion', JSON.stringify(user));

    });
    
    it('Should be created', () => {
        expect(VendedorService).toBeTruthy();
    })

    describe('Tests for Obtener Vendedores', () => {

        it('should get all Sales Persons', (doneFn) => {
            //Arrange
            const mockData : any = {
                codigo : 200,
                Mensaje: "Datos Obtenidos con exito",
                datos: [
                {
                    codigo: 10,
                    vendedor: 'Juan',
                    tipo: 'inside'
                },
                {
                    codigo: 11,
                    vendedor: 'Richard',
                    tipo: 'Vendedor'
                }]
            };

            let cliente = new Cliente('C0176','SETELLANTIS');
            let embarcar = new Embarcar('C0176001','STELLANTIS EMBARCAR A 1');

            _vendedor.obtenerVendedores(cliente,embarcar).subscribe({
                next: (datos) => {
                    expect(datos.codigo).toBe(200);
                    expect(datos).toEqual(mockData);

                    doneFn();
                }
            })

            let url = environment.apiurl + `/vendedores/vendedor.php?dominio=${user.dominio}&cliente=${cliente.cliente}&embarcar=${embarcar.codigo}`;
            const req = httpController.expectOne({method: 'GET',url});
            req.flush(mockData);
            httpController.verify(); 
 
        });

    });    

});

