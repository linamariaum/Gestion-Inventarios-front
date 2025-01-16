import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { InicioService } from '../../services/inicio.service';
import { Router } from '@angular/router';
import { ModalLoginComponent } from '../login/modal-login.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  imports: [CommonModule, NzButtonModule]
})
export class InicioComponent implements OnInit {
  mensaje: string = '';

  constructor(private readonly inicioService: InicioService,
    private readonly router: Router,
    private readonly nzModalService: NzModalService,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.obtenerMensajeBienvenida();
  }

  obtenerMensajeBienvenida() {
    this.inicioService.bienvenida().subscribe({
      next: (response: string) => {
        this.mensaje = response
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  mostrarLogin(): void {
      const modalLogin = this.nzModalService.create<ModalLoginComponent>({
        nzContent: ModalLoginComponent,
        nzTitle: 'Iniciar sesión',
        nzClosable: false,
        nzFooter: null
      });
      modalLogin.afterClose.subscribe(() => {
        this.router.navigate(['/inicio']);
      });
  }

  get isLogged(): boolean {
    return this.authService.isLogged();
  }

  logout() {
    this.authService.logout();
  }

}
