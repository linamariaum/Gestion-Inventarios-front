import { Component, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ProductoListaComponent } from './producto-lista/producto-lista.component';
import { ProductoCreacionComponent } from './producto-creacion/producto-creacion.component';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  imports: [CommonModule, ProductoListaComponent, NzButtonModule]
})
export class ProductoComponent {
  @ViewChild(ProductoListaComponent) productoListaComponent!: ProductoListaComponent;

  constructor(private readonly nzModalService: NzModalService) {}

  crearProducto(): void {
    const productoModal = this.nzModalService.create<ProductoCreacionComponent>({
      nzContent: ProductoCreacionComponent,
      nzTitle: 'Crear producto',
      nzClosable: false,
      nzFooter: null
    });
    productoModal.afterClose.subscribe(() => {
      this.productoListaComponent.listarProductos();
    });
  }
}
