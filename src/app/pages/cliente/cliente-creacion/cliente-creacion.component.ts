import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { MensajesControlFormularioDirective } from '../../../shared/directivas/mensajes-controles-formulario.directive';
import { NotificacionService } from '../../../services/notificacion.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { ClienteCreacion } from '../../../models/cliente-creacion';
import { ClienteService } from '../../../services/cliente.service';
import { ValidacionesFormulario } from '../../../shared/validaciones-formulario';


@Component({
  selector: 'app-cliente-creacion',
  standalone: true,
  templateUrl: './cliente-creacion.component.html',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, MensajesControlFormularioDirective]
})
export class ClienteCreacionComponent implements OnInit {
    formularioCliente!: FormGroup;
  
    constructor(private readonly nzModalRef: NzModalRef,
        private readonly clienteService: ClienteService,
        private readonly notificacionService: NotificacionService,
        private readonly formbuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.crearFormulario();
    }

    crearFormulario(): void {
        this.formularioCliente = this.formbuilder.group({
            nombre: [null, [Validators.required, Validators.minLength(3)]],
            email: [null, [Validators.required, ValidacionesFormulario.patronEmail]],
            telefono: [null, ValidacionesFormulario.numeroTelefonoConEspacio],
            username: [null, [Validators.required, Validators.minLength(3)]],
            rol: ['cliente', Validators.required],
            password: [null, Validators.required]
        });
    }        

    crearCliente(): void {
        if (this.formularioCliente.invalid) {
            UtilidadesFormulario.marcarErroresControlesFormulario(this.formularioCliente.controls);
            return;
        }
        const clienteCreacion: ClienteCreacion = this.formularioCliente.value;
        this.clienteService.crear(clienteCreacion)
            .subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Cliente creado correctamente');
                },
                error: () =>{
                    this.notificacionService.abrirNotificacionError('Error al crear cliente');
                }
        });
        this.nzModalRef.close();
    }
}
