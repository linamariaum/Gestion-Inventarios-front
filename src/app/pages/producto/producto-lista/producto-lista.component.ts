import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Producto } from '../../../models/producto';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ProductoService } from '../../../services/producto.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  templateUrl: './producto-lista.component.html',
  imports: [CommonModule, FormsModule, NzInputModule, NzPopconfirmModule, NzTableModule, NzIconModule, NzButtonModule, NzToolTipModule]
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  productosEditablesCache: { [key: string]: { editando: boolean; producto: Producto } } = {};

  constructor(private readonly productoService: ProductoService) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productoService.consultarProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.actualizarListaProductosEditablesCache();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  actualizarListaProductosEditablesCache(): void {
    this.productos.forEach(item => {
      this.productosEditablesCache[item.id] = {
        editando: false,
        producto: { ...item }
      };
    });
  }

  iniciarEdicion(id: string): void {
    this.productosEditablesCache[id].editando = true;
  }

  cancelarEdicion(id: string): void {
    const index = this.productos.findIndex(item => item.id === id);
    this.productosEditablesCache[id] = {
      producto: { ...this.productos[index] },
      editando: false
    };
  }

  guardarEdicion(id: string): void {
    const index = this.productos.findIndex(item => item.id === id);
    Object.assign(this.productos[index], this.productosEditablesCache[id].producto);
    this.productosEditablesCache[id].editando = false;
    this.productoService.actualizar(this.productosEditablesCache[id].producto).subscribe((productoActualizado: Producto) => {console.log(productoActualizado);});
  }

}
