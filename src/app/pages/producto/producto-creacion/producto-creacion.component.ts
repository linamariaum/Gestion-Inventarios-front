import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { MensajesControlFormularioDirective } from '../../../shared/directivas/mensajes-controles-formulario.directive';
import { NotificacionService } from '../../../services/notificacion.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { ProductoService } from '../../../services/producto.service';
import { ProductoCreacion } from '../../../models/producto-creacion';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ArchivoService } from '../../../services/archivo.service';

@Component({
  selector: 'app-producto-creacion',
  standalone: true,
  templateUrl: './producto-creacion.component.html',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, MensajesControlFormularioDirective, NzSelectModule, FormsModule, NzDividerModule]
})
export class ProductoCreacionComponent implements OnInit {
    formularioProducto!: FormGroup;
    categorias: Categoria[] = [];
  
    constructor(private readonly nzModalRef: NzModalRef,
        private readonly notificacionService: NotificacionService,
        private readonly formbuilder: FormBuilder,
        private readonly categoriaService: CategoriaService,
        private readonly productoService: ProductoService,
        private readonly clienteService: ClienteService,
        private readonly archivoService: ArchivoService
    ) {}

    ngOnInit(): void {
        this.crearFormulario();
        this.consultarCategorias();
        this.consultarCliente();
    }
    
    consultarCategorias(): void {
        this.categoriaService.consultar().subscribe((data: Categoria[]) => {
            this.categorias = data;
        });
    }

    crearFormulario(): void {
        this.formularioProducto = this.formbuilder.group({
            nombre: [null, [Validators.required, Validators.minLength(3)]],
            idCategoria: [null, Validators.required],
            precio: [null, [Validators.required, Validators.min(1)]],
            cantidad: [null, [Validators.required, Validators.min(1)]],
            idCliente: [null, Validators.required]
        });
    }    

    consultarCliente(): void {
        this.clienteService.consultarClienteAutenticado().subscribe({
            next: (cliente: Cliente) => {
                this.formularioProducto.get('idCliente')?.setValue(cliente.id);
            }
        });
    }

    crearProducto(): void {
        if (this.formularioProducto.invalid) {
            UtilidadesFormulario.marcarErroresControlesFormulario(this.formularioProducto.controls);
            return;
        }
        const productoCreacion: ProductoCreacion = this.formularioProducto.value;
        this.productoService.crear(productoCreacion)
            .subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Producto creado correctamente');
                },
                error: () =>{
                    this.notificacionService.abrirNotificacionError('Error al crear producto');
                }
        });
        this.nzModalRef.close();
    }

    async cargaMasiva(event: any): Promise<void> {
        const file = event.target.files[0];
        const estructuraValida = await this.archivoService.validarEstructuraArchivoCSV(file, ['nombre', 'idCategoria', 'precio', 'cantidad']);
        if (estructuraValida) {
            this.productoService.cargaMasiva(file).subscribe({
                next: () => {
                    this.notificacionService.abrirNotificacionExito('Productos cargadas correctamente');
                    this.nzModalRef.close();
                },
                error: () => {
                    this.notificacionService.abrirNotificacionError('Error al cargar productos');
                    this.nzModalRef.close();
                }
            });
        } else {
            this.notificacionService.abrirNotificacionError('El archivo no es válido o no contiene las columnas requeridas');
            this.nzModalRef.close();
        }
    }
}
