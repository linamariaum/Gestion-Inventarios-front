import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BienvenidaService {

  constructor(private http: HttpClient) {}

  public bienvenida(): Observable<any> {
    return this.http.get<any>('api/').pipe(map((response) => response as any));
  }
}