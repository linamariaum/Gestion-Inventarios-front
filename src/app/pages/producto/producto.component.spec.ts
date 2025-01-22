import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductoComponent } from './producto.component';
import { ProductoCreacionComponent } from './producto-creacion/producto-creacion.component';
import { By } from '@angular/platform-browser';

describe('ProductoComponent', () => {
  let component: ProductoComponent;
  let fixture: ComponentFixture<ProductoComponent>;
  let modalServiceSpy: jasmine.SpyObj<NzModalService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NzModalService', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        NzButtonModule
      ],
      providers: [
        ProductoComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NzModalService, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoComponent);
    component = fixture.componentInstance;
    modalServiceSpy = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe abrir el modal de creación de producto y listar productos después de cerrar el modal', () => {
    const listarProductosSpy = spyOn(component.productoListaComponent, 'listarProductos');
    const afterCloseSubject = of(null);
    modalServiceSpy.create.and.returnValue({
      afterClose: afterCloseSubject
    } as any);

    component.crearProducto();

    expect(modalServiceSpy.create).toHaveBeenCalledWith({
      nzContent: ProductoCreacionComponent,
      nzTitle: 'Crear producto',
      nzClosable: false,
      nzFooter: null
    });
    expect(listarProductosSpy).toHaveBeenCalled();
  });

  it('Debe llamar al método crearProducto al hacer clic en el botón "Crear Producto"', () => {
    const crearProductoSpy = spyOn(component, 'crearProducto');
    const botonCrearProducto = fixture.debugElement.query(By.css('#crear-producto')).nativeElement;
    botonCrearProducto.click();
    expect(crearProductoSpy).toHaveBeenCalled();
  });
});
