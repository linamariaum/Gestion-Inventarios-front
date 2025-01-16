import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from './services/auth.service';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly authService: AuthService = inject(AuthService);

  title = 'Gestion Inventarios';
  isCollapsed = false;
  usuarioAutenticado: Usuario = { username: '', rol: '' };

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioAutenticado = usuario;
    });
  }

  ngOnDestroy(): void {
    this.authService.logout();
  }

  get isAdministrador(): boolean {
    return this.authService.isAdministrador();
  }
}
