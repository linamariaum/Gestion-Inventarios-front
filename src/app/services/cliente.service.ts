import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HttpService } from '../core/http.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { ClienteCreacion } from '../models/cliente-creacion';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends HttpService {
  private readonly URL = ConstantesRutas.msClientes;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public crear(cliente: ClienteCreacion): Observable<Cliente> {
    return this.doPost(`${this.URL}`, cliente).pipe(map((response) => response as Cliente));
  }

  public consultarClientes(): Observable<Cliente[]> {
    return this.doGet<Cliente[]>(`${this.URL}/all`).pipe(map((response: Cliente[]) => response));
  }

  public consultarClienteAutenticado(): Observable<Cliente> {
    return this.doGet<Cliente>(`${this.URL}`).pipe(map((response: Cliente) => response));
  }
}
