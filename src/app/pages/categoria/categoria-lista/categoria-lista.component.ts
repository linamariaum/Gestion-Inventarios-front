import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  templateUrl: './categoria-lista.component.html',
  imports: [CommonModule, NzTableModule, NzIconModule]
})
export class CategoriaListaComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando = true;

  constructor(private readonly categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categoriaService.consultar().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}
