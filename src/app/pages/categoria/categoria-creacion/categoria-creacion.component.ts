import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { MensajesControlFormularioDirective } from '../../../shared/directivas/mensajes-controles-formulario.directive';
import { NotificacionService } from '../../../services/notificacion.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { CategoriaService } from '../../../services/categoria.service';
import { ArchivoService } from '../../../services/archivo.service';

@Component({
  selector: 'app-categoria-creacion',
  standalone: true,
  templateUrl: './categoria-creacion.component.html',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, MensajesControlFormularioDirective, NzDividerModule]
})
export class CategoriaCreacionComponent implements OnInit {
    formularioCategoria!: UntypedFormGroup;
  
    constructor(private readonly nzModalRef: NzModalRef,
        private readonly categoriaService: CategoriaService,
        private readonly notificacionService: NotificacionService,
        private readonly archivoService: ArchivoService
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

    async cargaMasiva(event: any): Promise<void> {
        const file = event.target.files[0];
        const estructuraValida = await this.archivoService.validarEstructuraArchivoCSV(file, ['nombre']);
        if (estructuraValida) {
            this.categoriaService.cargaMasiva(file).subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Categorías cargadas correctamente');
                    this.nzModalRef.close();
                },
                error: () => {
                    this.notificacionService.abrirNotificacionError('Error al cargar categorías');
                    this.nzModalRef.close();
                }
            });
        } else {
            this.notificacionService.abrirNotificacionError('El archivo no es válido o no contiene las columnas requeridas');
            this.nzModalRef.close();
        }
    }
}
