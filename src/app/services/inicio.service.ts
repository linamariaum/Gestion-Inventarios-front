import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HttpService } from '../core/http.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Mensaje } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class InicioService extends HttpService {

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public bienvenida(): Observable<string> {
    return this.doGet<Mensaje>(`${ConstantesRutas.msInicio}/health`).pipe(map((response: Mensaje) => response.detail));
  }
}
