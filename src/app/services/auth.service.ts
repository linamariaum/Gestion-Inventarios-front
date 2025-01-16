import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { HttpService } from '../core/http.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Token } from '../core/token';
import { NotificacionService } from './notificacion.service';
import { Usuario } from '../models/usuario';
import { Constantes } from '../core/constantes';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {
  readonly ADMIN = Constantes.ADMIN;
  private readonly usuarioSubject: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>({ username: '', rol: '' });
  public usuario$: Observable<Usuario> = this.usuarioSubject.asObservable();

  constructor(protected override http: HttpClient,
          private readonly notificacionService: NotificacionService) {
    super(http);
  }

  public autenticar(username: string, password: string): Observable<void> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.doPost<any, Token>(`${ConstantesRutas.msLogin}`, body.toString(), undefined, true).pipe(map((response: Token) => this.setSession(response, username)));
  }

  private setSession(token: Token, username: string) {
    sessionStorage.setItem('id_token', token.access_token);
    this.usuarioSubject.next({ username: username, rol: token.rol });
  }

  isLogged(): boolean {
    return sessionStorage.getItem('id_token') !== null
  }

  isAdministrador(): boolean {
    return this.usuarioSubject.value.rol === this.ADMIN;
  }

  logout() {
    sessionStorage.removeItem('id_token');
    this.usuarioSubject.next({ username: '', rol: '' });
    this.notificacionService.abrirNotificacionAdvertencia('Log out efectuado');
  }
}
