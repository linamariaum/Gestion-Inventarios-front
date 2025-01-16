import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  templateUrl: './cliente-lista.component.html',
  imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule]
})
export class ClienteListaComponent implements OnInit {
  clientes: Cliente[] = [];
  cargando = true;

  constructor(private readonly clienteService: ClienteService) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.cargando = true;
    this.clienteService.consultarClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}
