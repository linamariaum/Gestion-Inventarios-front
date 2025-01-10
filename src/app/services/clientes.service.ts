import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) {}

  public consultarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('api/v1/clientes/all').pipe(map((response) => response as Cliente[]));
  }

  public consultarCliente(): Observable<Cliente> {
    return this.http.get<Cliente>('api/v1/clientes/').pipe(map((response) => response as Cliente));
  }
}