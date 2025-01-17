import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HttpService } from '../core/http.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { ProductoCreacion } from '../models/producto-creacion';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends HttpService {
  private readonly URL = ConstantesRutas.msProductos;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public cargaMasiva(productos: File): Observable<any> {
    const formDataProductos = new FormData();
    formDataProductos.append('file', productos, productos.name);
    return this.doPostFile<object, any>(`${this.URL}/carga-masiva`, formDataProductos);
  }

  public crear(producto: ProductoCreacion): Observable<Producto> {
    return this.doPost(`${this.URL}`, producto).pipe(map((response) => response as Producto));
  }

  public actualizar(producto: Producto): Observable<Producto> {
    const rutaPeticion = `${this.URL}/${producto.id}`;
    return this.doPut(rutaPeticion, producto).pipe(map((response) => response as Producto));
  }

  public consultarProductos(): Observable<Producto[]> {
    return this.doGet<Producto[]>(`${this.URL}`).pipe(map((response: Producto[]) => response));
  }

  public consultarProducto(idProducto: number): Observable<Producto> {
    return this.doGet<Producto>(`${this.URL}/${idProducto}`).pipe(map((response: Producto) => response));
  }

  public consultarProductosPorCategoria(idCategoria: number): Observable<Producto[]> {
    return this.doGet<Producto[]>(`${this.URL}/categoria/${idCategoria}`).pipe(map((response: Producto[]) => response));
  }
}
