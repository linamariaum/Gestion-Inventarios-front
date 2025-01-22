import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ClienteService } from './cliente.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Cliente } from '../models/cliente';
import { ClienteCreacion } from '../models/cliente-creacion';
import { ClienteTestDataBuilder } from '../models/cliente.builder.spec';
import { Usuario } from '../models/usuario';
import { UsuarioTestDataBuilder } from '../models/usuario.builder.spec';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClienteService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe crear un cliente', () => {
    const dummyResponse: Cliente = new ClienteTestDataBuilder().build();
    const dummyUsuarioCreacion: Usuario = new UsuarioTestDataBuilder().build();
    const dummyCliente: ClienteCreacion = { password: 'mypassword', ...dummyUsuarioCreacion, ...dummyResponse };

    service.crear(dummyCliente).subscribe((cliente) => {
      expect(cliente).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msClientes}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('Debe obtener la lista de clientes', () => {
    const dummyClientes: Cliente[] = [
      new ClienteTestDataBuilder().build(),
      new ClienteTestDataBuilder().withId('2').withNombre('Cliente de prueba 2').build()
    ];

    service.consultarClientes().subscribe((clientes) => {
      expect(clientes).toEqual(dummyClientes);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msClientes}/all`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyClientes);
  });

  it('Debe obtener el cliente autenticado en el token de sesion', () => {
    const dummyCliente: Cliente = new ClienteTestDataBuilder().build();

    service.consultarClienteAutenticado().subscribe((cliente) => {
      expect(cliente).toEqual(dummyCliente);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msClientes}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCliente);
  });
});
