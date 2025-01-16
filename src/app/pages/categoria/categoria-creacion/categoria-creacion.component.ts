import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { MensajesControlFormularioDirective } from '../../../shared/directivas/mensajes-controles-formulario.directive';
import { NotificacionService } from '../../../services/notificacion.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { CategoriaService } from '../../../services/categoria.service';


@Component({
  selector: 'app-categoria-creacion',
  standalone: true,
  templateUrl: './categoria-creacion.component.html',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, MensajesControlFormularioDirective]
})
export class CategoriaCreacionComponent implements OnInit {
    formularioCategoria!: UntypedFormGroup;
  
    constructor(private readonly nzModalRef: NzModalRef,
        private readonly categoriaService: CategoriaService,
        private readonly notificacionService: NotificacionService
    ) {}

    ngOnInit(): void {
        this.crearFormulario();
    }

    crearFormulario(): void {
        this.formularioCategoria = new UntypedFormBuilder().group({
            nombre: [null, [Validators.required, Validators.minLength(3)]]
        });
    }        

    crearCategoria(): void {
        if (this.formularioCategoria.invalid) {
            UtilidadesFormulario.marcarErroresControlesFormulario(this.formularioCategoria.controls);
            return;
        }
        this.categoriaService.crear({ nombre: this.formularioCategoria.get('nombre')!.value})
            .subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Categoría creada correctamente');
                },
                error: () =>{
                    this.notificacionService.abrirNotificacionError('Error al crear categoría');
                }
            });
        this.nzModalRef.close();
    }
}
