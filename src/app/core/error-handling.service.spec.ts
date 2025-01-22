import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from './error-handling.service';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let nzModalService: NzModalService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const nzModalServiceSpy = jasmine.createSpyObj('NzModalService', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    const mockNzModalRef = {
      afterClose: of()
    };
    nzModalServiceSpy.create.and.returnValue(mockNzModalRef);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NzModalService, useValue: nzModalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ErrorHandlingService);
    nzModalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('Debe crear el service', () => {
    expect(service).toBeTruthy();
  });

  it('Debe manejar el error de UNAUTHORIZED', () => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: { detail: 'Unauthorized' }
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      }
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
    expect(nzModalService.create).toHaveBeenCalled();
  });

  it('Debe manejar el error de FORBIDDEN', () => {
    const errorResponse = new HttpErrorResponse({
      status: 403,
      error: { detail: 'Forbidden' }
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      }
    });

    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
    expect(nzModalService.create).toHaveBeenCalled();
  });

  it('Debe manejar el error general cuando es de tipo JSON blob', () => {
    const errorBlob = new Blob([JSON.stringify({ detail: 'Error' })], { type: 'application/json' });
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: errorBlob
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      }
    });

    errorBlob.text().then((text) => {
      const jsonError = JSON.parse(text);
      expect(nzModalService.create).toHaveBeenCalled();
    });
  });

  it('Debe manejar el error general cuando es de tipo non-JSON blob', () => {
    const errorBlob = new Blob(['Error'], { type: 'text/plain' });
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: errorBlob
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      }
    });

    expect(nzModalService.create).toHaveBeenCalled();
  });

  it('Debe devolver true cuando la cookie del documento incluye la cookie de verificación', function () {
    spyOnProperty(document, 'cookie').and.returnValue('XSRF-TOKEN=abc123');
    const result = service.tieneCookieVerificacion();
    expect(result).toBeTrue();
  });

  it('Debe retornar falso cuando la cookie del documento este vacia', function () {
    spyOnProperty(document, 'cookie').and.returnValue('');
    const result = service.tieneCookieVerificacion();
    expect(result).toBeFalse();
  });
});
