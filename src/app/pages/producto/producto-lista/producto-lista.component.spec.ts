import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoListaComponent } from './producto-lista.component';
import { ProductoService } from '../../../services/producto.service';
import { ArchivoService } from '../../../services/archivo.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { utils } from 'xlsx';

import { Producto } from '../../../models/producto';
import { ProductoTestDataBuilder } from '../../../models/producto.builder.spec';
import { CategoriaTestDataBuilder } from '../../../models/categoria.builder.spec';

describe('ProductoListaComponent', () => {
  let component: ProductoListaComponent;
  let fixture: ComponentFixture<ProductoListaComponent>;
  let productoServiceSpy: jasmine.SpyObj<ProductoService>;
  let archivoServiceSpy: jasmine.SpyObj<ArchivoService>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;

  beforeEach(async () => {
    const productoSpy = jasmine.createSpyObj('ProductoService', ['consultarProductos', 'actualizar']);
    const archivoSpy = jasmine.createSpyObj('ArchivoService', ['generarHojaExcelGenerica', 'createWorkbook', 'writeFile']);
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionAdvertencia', 'abrirNotificacionExito', 'abrirNotificacionError']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        NzInputModule,
        NzPopconfirmModule,
        NzTableModule,
        NzIconModule,
        NzButtonModule,
        NzToolTipModule,
        NzDividerModule,
        NoopAnimationsModule,
        ProductoListaComponent
      ],
      providers: [
        { provide: ProductoService, useValue: productoSpy },
        { provide: ArchivoService, useValue: archivoSpy },
        { provide: NotificacionService, useValue: notificacionSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoListaComponent);
    component = fixture.componentInstance;
    productoServiceSpy = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    archivoServiceSpy = TestBed.inject(ArchivoService) as jasmine.SpyObj<ArchivoService>;
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    productoServiceSpy.consultarProductos.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe listar los productos al inicializar el componente', () => {
    const llamadoListaCache = spyOn(component, 'actualizarListaProductosEditablesCache');
    const productos: Producto[] = [
        new ProductoTestDataBuilder()
            .withNombre('Producto 1')
            .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
            .build()
    ];
    productoServiceSpy.consultarProductos.and.returnValue(of(productos));

    component.ngOnInit();

    expect(component.productos).toEqual(productos);
    expect(component.cargando).toBeFalse();
    expect(llamadoListaCache).toHaveBeenCalled();
  });

  it('Debe al intentar listar los productos al inicializar el componente manejar el error', () => {
    productoServiceSpy.consultarProductos.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.productos).toEqual([]);
    expect(component.cargando).toBeFalse();
  });

  it('Debe iniciar la edición de un producto', () => {
    const producto: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .build();
    component.productos = [producto];
    component.actualizarListaProductosEditablesCache();

    component.iniciarEdicion(producto.id);

    expect(component.productosEditablesCache[producto.id].editando).toBeTrue();
  });

  it('Debe cancelar la edición de un producto', () => {
    const producto: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .build();
    component.productos = [producto];
    component.actualizarListaProductosEditablesCache();
    component.iniciarEdicion(producto.id);

    component.cancelarEdicion(producto.id);

    expect(component.productosEditablesCache[producto.id].editando).toBeFalse();
    expect(component.productosEditablesCache[producto.id].producto).toEqual(producto);
  });

  it('Debe guardar la edición de un producto y enviarla al api', () => {
    const producto: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .build();
    const productoActualizado: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1 Actualizado')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .withPrecio(150)
        .withCantidad(20)
        .build();
    component.productos = [producto];
    component.actualizarListaProductosEditablesCache();
    component.productosEditablesCache[producto.id].producto = productoActualizado;
    productoServiceSpy.actualizar.and.returnValue(of(productoActualizado));

    component.guardarEdicion(producto.id);

    expect(component.productos[0]).toEqual(productoActualizado);
    expect(component.productosEditablesCache[producto.id].editando).toBeFalse();
    expect(component.productosEditablesCache[producto.id].producto).toEqual(productoActualizado);
    expect(productoServiceSpy.actualizar).toHaveBeenCalledWith(productoActualizado);
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith(`Producto ${productoActualizado.nombre} actualizado correctamente`);
  });

  it('Debe al intentar guardar la edición de un producto manejar el error cuando corresponda', () => {
    const productoOriginal: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .build();
    const productoActualizado: Producto = new ProductoTestDataBuilder()
        .withNombre('Producto 1 Actualizado')
        .withCategoria(new CategoriaTestDataBuilder().withNombre('Categoría 1').build())
        .withPrecio(150)
        .withCantidad(20)
        .build();
    component.productos = [productoOriginal];
    component.actualizarListaProductosEditablesCache();
    component.productosEditablesCache[productoOriginal.id].producto = productoActualizado;
    productoServiceSpy.actualizar.and.returnValue(throwError(() => new Error('Error')));

    component.guardarEdicion(productoOriginal.id);

    expect(component.productos[0]).toEqual(productoOriginal);
    expect(component.productosEditablesCache[productoOriginal.id].editando).toBeFalse();
    expect(component.productosEditablesCache[productoOriginal.id].producto).toEqual(productoOriginal);
    expect(productoServiceSpy.actualizar).toHaveBeenCalledWith(productoActualizado);
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al actualizar el producto');
  });

  it('Debe descargar los productos en un archivo Excel', () => {
    const productos: Producto[] = [{ id: '1', nombre: 'Producto 1', categoria: { nombre: 'Categoría 1' }, precio: 100, cantidad: 10 }];
    component.productos = productos;

    const mockWorkbook = utils.book_new();
    archivoServiceSpy.generarHojaExcelGenerica.calls.reset();
    archivoServiceSpy.createWorkbook.and.returnValue(mockWorkbook);
    archivoServiceSpy.generarHojaExcelGenerica.and.callThrough();

    component.descargarProductos();

    expect(archivoServiceSpy.createWorkbook).toHaveBeenCalled();
    expect(archivoServiceSpy.generarHojaExcelGenerica).toHaveBeenCalledWith(
        mockWorkbook,
        'Productos',
        ['ID', 'NOMBRE', 'CATEGORIA', 'PRECIO', 'CANTIDAD'],
        [['1', 'Producto 1', 'Categoría 1', '100', '10']]
    );
    expect(archivoServiceSpy.writeFile).toHaveBeenCalledWith(mockWorkbook, 'Productos.xlsx');
  });

  it('Debe mostrar una notificación de advertencia cuando no hay productos para descargar', () => {
    component.productos = [];
    component.descargarProductos();
    expect(notificacionServiceSpy.abrirNotificacionAdvertencia).toHaveBeenCalledWith('No hay productos para descargar');
  });
});
