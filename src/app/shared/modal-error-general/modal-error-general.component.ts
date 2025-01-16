import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-modal-error-general',
  standalone: true,
  templateUrl: './modal-error-general.component.html',
  imports: [CommonModule]
})
export class ModalErrorGeneralComponent {
  readonly modalRef: NzModalRef = inject(NzModalRef);
  readonly mensajeError: Mensaje = inject(NZ_MODAL_DATA);

}
