import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly NUMERO_REINTENTOS = 3;
  private readonly TIEMPO_ESPERA = 1000;
  private readonly FORBIDDEN = 403;

  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const parametros: ParametrosReintento = {
      limiteIntentos: this.NUMERO_REINTENTOS,
      tiempoEspera: this.TIEMPO_ESPERA,
      debeReintentar: ({ status }) => status > this.FORBIDDEN
    };

    const idToken = sessionStorage.getItem('id_token');

    if (idToken) {
      httpRequest = httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${idToken}`
        }
      });
    }

    return next.handle(httpRequest).pipe(
      retryWhen(reintentar(parametros, httpRequest.method)),
      catchError((error: HttpErrorResponse) => this.errorHandlingService.handleError(error))
    );
  }
}

export interface ParametrosReintento {
  limiteIntentos?: number;
  tiempoEspera?: number;
  debeReintentar?: (error: { status: number }) => boolean;
}


export const reintentar = (parametros: ParametrosReintento, metodo: string) => (intentos: Observable<any>) =>
  intentos.pipe(
    mergeMap((error, i) => {
      const { limiteIntentos = 0, tiempoEspera = 0, debeReintentar } = parametros;
      const intento = i + 1;

      if (intento >= limiteIntentos || (debeReintentar && !debeReintentar(error)) || ['POST', 'PUT', 'PATCH'].includes(metodo)) {
        return throwError(() => error);
      }

      return timer(intento * tiempoEspera);
    })
  );


// ------------------------------
// @Injectable()
// export class HttpInterceptorService implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {

//         if (error.status === 401) {
//           // Handle 401 error
//           console.error('Unauthorized request - 401');
//         }
//         return throwError(error);
//       })
//     );
//   }
// }