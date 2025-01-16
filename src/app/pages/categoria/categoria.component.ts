import { Component, ViewChild } from '@angular/core';
import { CategoriaListaComponent } from './categoria-lista/categoria-lista.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CategoriaCreacionComponent } from './categoria-creacion/categoria-creacion.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-categoria',
  standalone: true,
  templateUrl: './categoria.component.html',
  imports: [CommonModule, CategoriaListaComponent, NzButtonModule]
})
export class CategoriaComponent {
  @ViewChild(CategoriaListaComponent) categoriaListaComponent!: CategoriaListaComponent;

  constructor(private readonly authService: AuthService,
    private readonly nzModalService: NzModalService
  ) {}

  get isAdministrador(): boolean {
      return this.authService.isAdministrador();
  }

  crearCategoria(): void {
    const categoriaModal = this.nzModalService.create<CategoriaCreacionComponent>({
      nzContent: CategoriaCreacionComponent,
      nzTitle: 'Crear categoría',
      nzClosable: false,
      nzFooter: null
    });
    categoriaModal.afterClose.subscribe(() => {
      this.categoriaListaComponent.listarCategorias();
    });
  }
}
