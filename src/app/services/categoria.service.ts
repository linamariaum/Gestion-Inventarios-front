import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HttpService } from '../core/http.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends HttpService {
  private readonly URL = ConstantesRutas.msCategorias;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public crear(categoria: Categoria): Observable<Categoria> {
    return this.doPost(`${this.URL}`, categoria).pipe(map((response) => response as Categoria));
  }

  public consultar(): Observable<Categoria[]> {
    return this.doGet<Categoria[]>(`${this.URL}`).pipe(map((response: Categoria[]) => response));
  }

  public cargaMasiva(categorias: File): Observable<any> {
    const formDataCategorias = new FormData();
    formDataCategorias.append('file', categorias, categorias.name);
    return this.doPostFile<object, any>(`${this.URL}/carga-masiva`, formDataCategorias);
  }
}
