import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, throwError } from 'rxjs';

import { ModalErrorGeneralComponent } from '../shared/modal-error-general/modal-error-general.component';
import { Mensaje } from '../models/mensaje';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  private readonly UNAUTHORIZED = 401;
  private readonly FORBIDDEN = 403;
  private readonly NO_PERMISOS = 'Ingreso no autorizado, no cuenta con permisos para esta acción';
  private readonly COOKIE_VERIFICACION = 'XSRF-TOKEN';

  constructor(
    private readonly nzModalService: NzModalService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  handleError(error: HttpErrorResponse): Observable<any> {
    switch (error.status) {
      case this.UNAUTHORIZED:
          this.mostrarModalErrorGeneral(error.error);
          this.authService.logout();
          this.router.navigate(['/inicio']);
        break;
      case this.FORBIDDEN:
        this.mostrarModalSinAutorizacion();
        this.router.navigate(['/inicio']);
        break;
      default:
        if (error.error instanceof Blob && error.error.type === 'application/json') {
          error.error.text().then((text) => {
            const jsonError = JSON.parse(text);
            this.mostrarModalErrorGeneral(jsonError);
          });
        } else {
          this.mostrarModalErrorGeneral(error.error);
        }
        return throwError(() => error);
    }
    return throwError(() => error);
  }

  tieneCookieVerificacion(): boolean {
    return document.cookie.includes(this.COOKIE_VERIFICACION);
  }

  private mostrarModalSinAutorizacion(): void {
    const modalUnauthorized = this.nzModalService.create<ModalErrorGeneralComponent, Mensaje>({
      nzData: { detail: this.NO_PERMISOS },
      nzContent: ModalErrorGeneralComponent,
      nzClosable: false
    });
    modalUnauthorized.afterClose.subscribe(() => {
      this.router.navigate(['/inicio']);
    });
  }

  private mostrarModalErrorGeneral(errorDetail: Mensaje): NzModalRef {
    console.log('Error en la petición: ');
    console.log(errorDetail);
    return this.nzModalService.create<ModalErrorGeneralComponent, Mensaje>({
      nzData: errorDetail,
      nzContent: ModalErrorGeneralComponent,
      nzClosable: false
    });
  }
}
