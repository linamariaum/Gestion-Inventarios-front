import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoCreacionComponent } from './producto-creacion.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { PlusSquareOutline, DollarOutline, CalculatorOutline, TagOutline } from '@ant-design/icons-angular/icons';

import { NotificacionService } from '../../../services/notificacion.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ProductoService } from '../../../services/producto.service';
import { ClienteService } from '../../../services/cliente.service';
import { ArchivoService } from '../../../services/archivo.service';
import { CategoriaTestDataBuilder } from '../../../models/categoria.builder.spec';
import { ClienteTestDataBuilder } from '../../../models/cliente.builder.spec';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { ProductoTestDataBuilder } from '../../../models/producto.builder.spec';
import { ProductoCreacion } from '../../../models/producto-creacion';

describe('ProductoCreacionComponent', () => {
  let component: ProductoCreacionComponent;
  let fixture: ComponentFixture<ProductoCreacionComponent>;
  let nzModalRefSpy: jasmine.SpyObj<NzModalRef>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;
  let categoriaServiceSpy: jasmine.SpyObj<CategoriaService>;
  let productoServiceSpy: jasmine.SpyObj<ProductoService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let archivoServiceSpy: jasmine.SpyObj<ArchivoService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NzModalRef', ['close']);
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionExito', 'abrirNotificacionError']);
    const categoriaSpy = jasmine.createSpyObj('CategoriaService', ['consultar']);
    const productoSpy = jasmine.createSpyObj('ProductoService', ['crear', 'cargaMasiva']);
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['consultarClienteAutenticado']);
    const archivoSpy = jasmine.createSpyObj('ArchivoService', ['validarEstructuraArchivoCSV']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzDividerModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
        NzIconModule
      ],
      providers: [
        ProductoCreacionComponent,
        { provide: NzModalRef, useValue: modalSpy },
        { provide: NotificacionService, useValue: notificacionSpy },
        { provide: CategoriaService, useValue: categoriaSpy },
        { provide: ProductoService, useValue: productoSpy },
        { provide: ClienteService, useValue: clienteSpy },
        { provide: ArchivoService, useValue: archivoSpy },
        { provide: NZ_ICONS, useValue: [PlusSquareOutline, DollarOutline, CalculatorOutline, TagOutline] },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoCreacionComponent);
    component = fixture.componentInstance;
    nzModalRefSpy = TestBed.inject(NzModalRef) as jasmine.SpyObj<NzModalRef>;
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    categoriaServiceSpy = TestBed.inject(CategoriaService) as jasmine.SpyObj<CategoriaService>;
    productoServiceSpy = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    archivoServiceSpy = TestBed.inject(ArchivoService) as jasmine.SpyObj<ArchivoService>;
    categoriaServiceSpy.consultar.and.returnValue(of([]));
    clienteServiceSpy.consultarClienteAutenticado.and.returnValue(of(new ClienteTestDataBuilder().build()));
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe crear el formulario de producto al inicializar el componente', () => {
    expect(component.formularioProducto).toBeDefined();
    expect(component.formularioProducto.controls['nombre']).toBeDefined();
    expect(component.formularioProducto.controls['idCategoria']).toBeDefined();
    expect(component.formularioProducto.controls['precio']).toBeDefined();
    expect(component.formularioProducto.controls['cantidad']).toBeDefined();
    expect(component.formularioProducto.controls['idCliente']).toBeDefined();
  });

  it('Debe consultar las categorías al inicializar el componente', () => {
    const categorias = [new CategoriaTestDataBuilder().withId('1').withNombre('Categoría 1').build()];
    categoriaServiceSpy.consultar.and.returnValue(of(categorias));
    component.consultarCategorias();
    expect(component.categorias).toEqual(categorias);
  });

  it('Debe consultar el cliente autenticado al inicializar el componente', () => {
    const cliente = new ClienteTestDataBuilder().withId('1').build();
    clienteServiceSpy.consultarClienteAutenticado.and.returnValue(of(cliente));
    component.consultarCliente();
    expect(component.formularioProducto.get('idCliente')?.value).toEqual(cliente.id);
  });

  it('Debe mostrar mensajes de error cuando los campos están vacíos', () => {
    const nombreInput = fixture.debugElement.query(By.css('#nombre')).nativeElement;
    nombreInput.value = '';
    nombreInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const nombreError = fixture.debugElement.query(By.css('#control-nombre')).nativeElement;
    expect(nombreError.textContent).toContain('Este campo es obligatorio');
  });

  it('Debe llamar al método marcarErroresControlesFormulario cuando el formulario es inválido', () => {
    const llamadoUtilidadesFormulario = spyOn(UtilidadesFormulario, 'marcarErroresControlesFormulario');
    const productoCreacion = {
      nombre: null,
      idCategoria: 1,
      precio: 100,
      cantidad: null,
      idCliente: 1
    };
    component.formularioProducto.setValue(productoCreacion);

    component.crearProducto();

    expect(llamadoUtilidadesFormulario).toHaveBeenCalledWith(component.formularioProducto.controls);
    expect(productoServiceSpy.crear).not.toHaveBeenCalled();
    expect(notificacionServiceSpy.abrirNotificacionExito).not.toHaveBeenCalled();
    expect(nzModalRefSpy.close).not.toHaveBeenCalled();
  });

  it('Debe llamar al método crearProducto cuando el formulario es válido', () => {
    const llamadoUtilidadesFormulario = spyOn(UtilidadesFormulario, 'marcarErroresControlesFormulario');
    const producto = new ProductoTestDataBuilder().build();
    const productoCreacion: ProductoCreacion = {
      nombre: 'Producto 1',
      idCategoria: '1',
      precio: 100,
      cantidad: 10,
      idCliente: '1'
    };
    component.formularioProducto.setValue(productoCreacion);
    productoServiceSpy.crear.and.returnValue(of(producto));

    component.crearProducto();

    expect(llamadoUtilidadesFormulario).not.toHaveBeenCalled();
    expect(productoServiceSpy.crear).toHaveBeenCalledWith(productoCreacion);
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Producto creado correctamente');
    expect(notificacionServiceSpy.abrirNotificacionError).not.toHaveBeenCalled();
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar una notificación de error cuando la creación del producto falla', () => {
    const productoCreacion: ProductoCreacion = {
      nombre: 'Producto 1',
      idCategoria: '1',
      precio: 100,
      cantidad: 10,
      idCliente: '1'
    };
    component.formularioProducto.setValue(productoCreacion);
    productoServiceSpy.crear.and.returnValue(throwError(() => new Error('Error al crear producto')));

    component.crearProducto();

    expect(productoServiceSpy.crear).toHaveBeenCalledWith(productoCreacion);
    expect(notificacionServiceSpy.abrirNotificacionExito).not.toHaveBeenCalled();
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al crear producto');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe llamar al método cargaMasiva cuando se selecciona un archivo válido', async () => {
    const file = new File(['nombre,idCategoria,precio,cantidad'], 'productos.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(true));
    productoServiceSpy.cargaMasiva.and.returnValue(of(void 0));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre', 'idCategoria', 'precio', 'cantidad']);
    expect(productoServiceSpy.cargaMasiva).toHaveBeenCalledWith(file);
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Productos cargadas correctamente');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar una notificación de error cuando la carga masiva falla', async () => {
    const file = new File(['nombre,idCategoria,precio,cantidad'], 'productos.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(true));
    productoServiceSpy.cargaMasiva.and.returnValue(throwError(() => new Error('Error en la carga masiva')));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre', 'idCategoria', 'precio', 'cantidad']);
    expect(productoServiceSpy.cargaMasiva).toHaveBeenCalledWith(file);
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al cargar productos');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar una notificación de error cuando el archivo no es válido', async () => {
    const file = new File(['nombre,idCategoria,precio,cantidad'], 'productos.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    archivoServiceSpy.validarEstructuraArchivoCSV.and.returnValue(Promise.resolve(false));

    await component.cargaMasiva(event);

    expect(archivoServiceSpy.validarEstructuraArchivoCSV).toHaveBeenCalledWith(file, ['nombre', 'idCategoria', 'precio', 'cantidad']);
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('El archivo no es válido o no contiene las columnas requeridas');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });
});
