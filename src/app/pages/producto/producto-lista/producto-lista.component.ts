import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { ArchivoService } from '../../../services/archivo.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  templateUrl: './producto-lista.component.html',
  imports: [CommonModule, FormsModule, NzInputModule, NzPopconfirmModule, NzTableModule, NzIconModule, NzButtonModule, NzToolTipModule, NzDividerModule]
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  productosEditablesCache: { [key: string]: { editando: boolean; producto: Producto } } = {};

  constructor(private readonly productoService: ProductoService,
    private readonly archivoService: ArchivoService,
    private readonly notificacionService: NotificacionService) {}

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
    const productoOriginal = this.productos[index];
    Object.assign(this.productos[index], this.productosEditablesCache[id].producto);
    this.productosEditablesCache[id].editando = false;
    this.productoService.actualizar(this.productosEditablesCache[id].producto)
    .subscribe({
      next: (productoActualizado: Producto) => {
        this.notificacionService.abrirNotificacionExito(`Producto ${productoActualizado.nombre} actualizado correctamente`);
      },
      error: () => {
        this.notificacionService.abrirNotificacionError('Error al actualizar el producto');
        this.productosEditablesCache[id].producto = productoOriginal;
      }
    });
  }

  descargarProductos(): void {
    if (this.productos.length) {
      const workbook = this.archivoService.createWorkbook();
      const encabezado = Object.values(['ID', 'NOMBRE', 'CATEGORIA', 'PRECIO', 'CANTIDAD']);
      const datos: string[][] = this.construirDatosParaDescargar(this.productos);
      this.archivoService.generarHojaExcelGenerica(workbook, 'Productos', encabezado, datos);
      this.archivoService.writeFile(workbook, 'Productos.xlsx');
    } else {
      this.notificacionService.abrirNotificacionAdvertencia('No hay productos para descargar');
    }
  }

  construirDatosParaDescargar(productos: Producto[]): string[][] {
    return productos.map(
      (producto: Producto) => {
        return {
          id: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria?.nombre,
          precio: producto.precio,
          cantidad: producto.cantidad
        }
      }).map(dato => Object.values(dato).map(value => value ? value.toString() : ''));
  }
}
