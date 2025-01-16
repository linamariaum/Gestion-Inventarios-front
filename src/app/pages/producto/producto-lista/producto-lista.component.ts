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
  editCache: { [key: string]: { edit: boolean; data: Producto } } = {};

  constructor(private readonly productoService: ProductoService) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productoService.consultarProductos().subscribe((data: Producto[]) => {
      this.productos = data;
      this.updateEditCache();
    });
    this.cargando = false;
  }

  updateEditCache(): void {
    this.productos.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.productos.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.productos[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.productos.findIndex(item => item.id === id);
    Object.assign(this.productos[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.productoService.actualizar(this.editCache[id].data).subscribe();
  }

}
