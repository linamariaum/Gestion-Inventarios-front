import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CategoriaCreacionComponent } from './categoria-creacion.component';
import { NotificacionService } from '../../../services/notificacion.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ArchivoService } from '../../../services/archivo.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { CategoriaTestDataBuilder } from '../../../models/categoria.builder.spec';
import { By } from '@angular/platform-browser';

describe('CategoriaCreacionComponent', () => {
  let component: CategoriaCreacionComponent;
  let fixture: ComponentFixture<CategoriaCreacionComponent>;
  let categoriaServiceSpy: jasmine.SpyObj<CategoriaService>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;
  let archivoServiceSpy: jasmine.SpyObj<ArchivoService>;
  let nzModalRefSpy: jasmine.SpyObj<NzModalRef>;

  beforeEach(async () => {
    const categoriaSpy = jasmine.createSpyObj('CategoriaService', ['crear', 'cargaMasiva']);
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionExito', 'abrirNotificacionError']);
    const archivoSpy = jasmine.createSpyObj('ArchivoService', ['validarEstructuraArchivoCSV']);
    const modalSpy = jasmine.createSpyObj('NzModalRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NzDividerModule,
        NzIconModule,
        BrowserAnimationsModule,
        CategoriaCreacionComponent
      ],
      providers: [
        { provide: CategoriaService, useValue: categoriaSpy },
        { provide: NotificacionService, useValue: notificacionSpy },
        { provide: ArchivoService, useValue: archivoSpy },
        { provide: NzModalRef, useValue: modalSpy },
        { provide: NZ_ICONS, useValue: [PlusOutline] }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaCreacionComponent);
    component = fixture.componentInstance;
    categoriaServiceSpy = TestBed.inject(CategoriaService) as jasmine.SpyObj<CategoriaService>;
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    archivoServiceSpy = TestBed.inject(ArchivoService) as jasmine.SpyObj<ArchivoService>;
    nzModalRefSpy = TestBed.inject(NzModalRef) as jasmine.SpyObj<NzModalRef>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario al inicializar el componente', () => {
    component.ngOnInit();
    expect(component.formularioCategoria).toBeDefined();
    expect(component.formularioCategoria.controls['nombre']).toBeDefined();
  });

  it('Debe mostrar un mensaje de error si el formulario es inválido al intentar crear una categoría', () => {
    spyOn(UtilidadesFormulario, 'marcarErroresControlesFormulario');
    component.crearCategoria();
    expect(UtilidadesFormulario.marcarErroresControlesFormulario).toHaveBeenCalledWith(component.formularioCategoria.controls);
  });

  it('Debe crear una categoría y mostrar un mensaje de éxito', () => {
    component.formularioCategoria.controls['nombre'].setValue('Nueva Categoría');
    categoriaServiceSpy.crear.and.returnValue(of(new CategoriaTestDataBuilder().build()));

    component.crearCategoria();

    expect(categoriaServiceSpy.crear).toHaveBeenCalledWith({ nombre: 'Nueva Categoría' });
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Categoría creada correctamente');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar un mensaje de error si la creación de la categoría falla', () => {
    component.formularioCategoria.controls['nombre'].setValue('Nueva Categoría');
    categoriaServiceSpy.crear.and.returnValue(throwError(() => new Error('Error al crear categoría')));

    component.crearCategoria();

    expect(categoriaServiceSpy.crear).toHaveBeenCalledWith({ nombre: 'Nueva Categoría' });
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al crear categoría');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe validar la estructura del archivo CSV y cargar categorías masivamente', async () => {
    const file = new File(['nombre\nCategoria1\nCategoria2'], 'categorias.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(true));
    categoriaServiceSpy.cargaMasiva.and.returnValue(of({}));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre']);
    expect(categoriaServiceSpy.cargaMasiva).toHaveBeenCalledWith(file);
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Categorías cargadas correctamente');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar un mensaje de error si la estructura del archivo CSV no es válida', async () => {
    const file = new File(['nombre\nCategoria1\nCategoria2'], 'categorias.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(false));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre']);
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('El archivo no es válido o no contiene las columnas requeridas');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar un mensaje de error si la carga masiva de categorías falla', async () => {
    const file = new File(['nombre\nCategoria1\nCategoria2'], 'categorias.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(true));
    categoriaServiceSpy.cargaMasiva.and.returnValue(throwError(() => new Error('Error al cargar categorías')));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre']);
    expect(categoriaServiceSpy.cargaMasiva).toHaveBeenCalledWith(file);
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al cargar categorías');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar mensajes de error cuando el campo está vacío o no cumple con la longitud', () => {
    const nombreInput = fixture.debugElement.query(By.css('#nombre')).nativeElement;
    nombreInput.value = '';
    const nombreInputError = fixture.debugElement.query(By.css('#control-nombre')).nativeElement;

    nombreInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(nombreInputError.textContent).toContain('Este campo es obligatorio');

    nombreInput.value = 'so';
    nombreInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(nombreInputError.textContent).toContain('Debe ingresar mínimo 3 caracteres');
  });
});
