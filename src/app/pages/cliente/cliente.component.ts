import { Component, ViewChild } from '@angular/core';
import { ClienteListaComponent } from './cliente-lista/cliente-lista.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ClienteCreacionComponent } from './cliente-creacion/cliente-creacion.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  imports: [CommonModule, ClienteListaComponent, NzButtonModule]
})
export class ClienteComponent {
  @ViewChild(ClienteListaComponent) clienteListaComponent!: ClienteListaComponent;

  constructor(private readonly nzModalService: NzModalService) {}

  crearCliente(): void {
    const clienteModal = this.nzModalService.create<ClienteCreacionComponent>({
      nzContent: ClienteCreacionComponent,
      nzTitle: 'Crear cliente',
      nzClosable: false,
      nzFooter: null
    });
    clienteModal.afterClose.subscribe(() => {
      this.clienteListaComponent.listarClientes();
    });
  }

}
