import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { MensajesControlFormularioDirective } from '../../shared/directivas/mensajes-controles-formulario.directive';
import { AuthService } from '../../services/auth.service';
import { UtilidadesFormulario } from '../../shared/utilidades-formulario';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  templateUrl: './modal-login.component.html',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, MensajesControlFormularioDirective]
})
export class ModalLoginComponent implements OnInit {
    formularioLogin!: UntypedFormGroup;

    constructor(private readonly nzModalRef: NzModalRef,
        private readonly authService: AuthService,
        private readonly notificacionService: NotificacionService
    ) {}

    ngOnInit(): void {
        this.crearFormulario();
    }

    crearFormulario(): void {
        this.formularioLogin = new UntypedFormBuilder().group({
            username: [null, [Validators.required, Validators.minLength(3)]],
            password: [null, Validators.required]
        });
    }        

    login(): void {
        if (this.formularioLogin.invalid) {
            UtilidadesFormulario.marcarErroresControlesFormulario(this.formularioLogin.controls);
            return;
        }
        this.authService.autenticar(this.formularioLogin.get('username')!.value, this.formularioLogin.get('password')!.value)
            .subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Autenticado correctamente');
                },
                error: () =>{
                    this.notificacionService.abrirNotificacionError('Error al autenticar');
                }
            });
        this.nzModalRef.close();
    }
}
