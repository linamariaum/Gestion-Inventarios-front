import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { NotificacionService } from './notificacion.service';
import { ClienteService } from './cliente.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Token } from '../core/token';
import { Cliente } from '../models/cliente';
import { ClienteTestDataBuilder } from '../models/cliente.builder.spec';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;

  beforeEach(() => {
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionError', 'abrirNotificacionAdvertencia']);
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['consultarClienteAutenticado']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificacionService, useValue: notificacionSpy },
        { provide: ClienteService, useValue: clienteSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe autenticar un usuario admin y establecer la sesión', () => {
    const dummyToken: Token = { access_token: 'dummy_token', rol: 'admin', token_type: 'bearer' };
    const username = 'testuser';
    const password = 'mypassword';

    service.autenticar(username, password).subscribe(() => {
      expect(sessionStorage.getItem('id_token')).toEqual(dummyToken.access_token);
      expect(service.usuarioSubject.value).toEqual({ username: username.toUpperCase(), rol: dummyToken.rol });
      expect(service.isAdministrador()).toBeTrue();
      expect(service.isLogged()).toBeTrue();
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msLogin}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyToken);
  });

  it('Debe autenticar un usuario cliente, obtener datos del cliente y establecer la sesión', () => {
    const dummyToken: Token = { access_token: 'dummy_token', rol: 'cliente', token_type: 'bearer' };
    const dummyCliente: Cliente = new ClienteTestDataBuilder().build();
    const username = 'testuser';
    const password = 'password';

    clienteServiceSpy.consultarClienteAutenticado.and.returnValue(of(dummyCliente));

    service.autenticar(username, password).subscribe(() => {
      expect(sessionStorage.getItem('id_token')).toEqual(dummyToken.access_token);
      expect(service.usuarioSubject.value).toEqual({ username: dummyCliente.nombre, rol: dummyToken.rol });
      expect(service.isAdministrador()).toBeFalse();
      expect(service.isLogged()).toBeTrue();
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msLogin}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyToken);
  });

  it('Debe efectuar el logout y limpiar la sesión', () => {
    service.logout();
    expect(service.isLogged()).toBeFalse();
    expect(service.usuarioSubject.value).toEqual({ username: '', rol: '' });
    expect(service.isAdministrador()).toBeFalse();
    expect(service.isLogged()).toBeFalse();
    expect(notificacionServiceSpy.abrirNotificacionAdvertencia).toHaveBeenCalledWith('Log out efectuado');
  });
});
