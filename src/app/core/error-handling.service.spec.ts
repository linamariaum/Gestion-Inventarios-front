import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ErrorHandlingService } from './error-handling.service';

describe('ErrorHandlingService', () => {
  let errorHandlingService: ErrorHandlingService;
  let nzModalService: NzModalService;
  let router: Router;

  beforeEach(() => {
    nzModalService = jasmine.createSpyObj('NzModalService', ['create']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    errorHandlingService = new ErrorHandlingService(nzModalService, router);
  });

  it('debe manejar el error de FORBIDDEN', () => {
    const error: HttpErrorResponse = { status: 403 } as HttpErrorResponse;
    errorHandlingService.handleError(error);
    expect(router.navigate).toHaveBeenCalledWith(['/busqueda-inicial']);
  });

  it('debe devolver true cuando la cookie del documento incluye la cookie de verificación', function () {
    spyOnProperty(document, 'cookie').and.returnValue('XSRF-TOKEN=abc123');
    const result = errorHandlingService.tieneCookieVerificacion();
    expect(result).toBe(true);
  });

  it('debe retornar falso cuando la cookie del documento este vacia', function () {
    spyOnProperty(document, 'cookie').and.returnValue('');
    const result = errorHandlingService.tieneCookieVerificacion();
    expect(result).toBe(false);
  });
});
