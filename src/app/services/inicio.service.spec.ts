import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InicioService } from './inicio.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Mensaje } from '../models/mensaje';

describe('InicioService', () => {
  let service: InicioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InicioService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(InicioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe obtener el mensaje de bienvenida', () => {
    const dummyResponse: Mensaje = { detail: 'Bienvenido' };

    service.bienvenida().subscribe((mensaje) => {
      expect(mensaje).toEqual('Bienvenido');
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msInicio}/health`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('Debe consultar el mensaje de bienvenida y retornar error cuando corresponda', (done: DoneFn) => {
    service.bienvenida().subscribe(respuesta => {
        expect(respuesta).toBeUndefined();
        done();
    });

    const peticionHttp = httpMock.expectOne(`${ConstantesRutas.msInicio}/health`);
    peticionHttp.flush({
        errores: [{
            mensaje: 'Ocurrió un error, intentelo nuevamente'
        }]
    });
    expect(peticionHttp.request.method).toBe('GET');
  });
});
