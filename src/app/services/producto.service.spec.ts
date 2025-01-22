import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductoService } from './producto.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { ProductoCreacion } from '../models/producto-creacion';
import { Producto } from '../models/producto';
import { ProductoTestDataBuilder } from '../models/producto.builder.spec';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe crear el producto', () => {
    const dummyResponse: Producto = new ProductoTestDataBuilder().build();
    const dummyProducto: ProductoCreacion = { idCategoria: '1', idCliente: '1', ...dummyResponse };
    
    service.crear(dummyProducto).subscribe((producto) => {
      expect(producto).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msProductos}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('Debe actualizar el producto', () => {
    const dummyProducto: Producto = new ProductoTestDataBuilder().build();

    service.actualizar(dummyProducto).subscribe((producto) => {
      expect(producto).toEqual(dummyProducto);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msProductos}/${dummyProducto.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyProducto);
  });

  it('Debe realizar la carga masiva de productos', (done: DoneFn) => {
    const dummyFile = new File(['content'], 'productos.csv', { type: 'text/csv' });

    service.cargaMasiva(dummyFile).subscribe((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msProductos}/carga-masiva`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('Debe consultar la lista de productos y retornar error cuando corresponda', (done: DoneFn) => {
    service.consultarProductos().subscribe(respuesta => {
        expect(respuesta).toBeTruthy();
        done();
    });

    const peticionHttp = httpMock.expectOne(`${ConstantesRutas.msProductos}`);
    peticionHttp.flush({
        errores: [{
            mensaje: 'Ocurrió un error, intentelo nuevamente'
        }]
    });
    expect(peticionHttp.request.method).toBe('GET');
  });

  it('Debe consultar la lista de productos de forma exitosa', (done: DoneFn) => {
    const dummyProductos: Producto[] = [new ProductoTestDataBuilder().build()];

    service.consultarProductos().subscribe(respuesta => {
      expect(respuesta.length).toEqual(1);
      expect(respuesta).toEqual(dummyProductos);
      expect(respuesta[0].nombre).toEqual('Producto de prueba');
      done();
    });

    const peticionHttp = httpMock.expectOne(`${ConstantesRutas.msProductos}`);
    peticionHttp.flush(dummyProductos);
    expect(peticionHttp.request.method).toBe('GET');    
  });

  it('Debe consultar un producto por id', () => {
    const dummyProducto = new ProductoTestDataBuilder()
      .withId('1')
      .withNombre('Producto 1')
      .withPrecio(100)
      .withCantidad(10)
      .build();

    service.consultarProducto(1).subscribe((producto) => {
      expect(producto).toEqual(dummyProducto);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msProductos}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducto);
  });

  it('Debe consultar la lista de productos por id de categoria', () => {
    const dummyProductos = [
      new ProductoTestDataBuilder().withId('1').withNombre('Producto 1').withPrecio(100).withCantidad(10).build(),
      new ProductoTestDataBuilder().withId('2').withNombre('Producto 2').withPrecio(200).withCantidad(20).build()
    ];

    service.consultarProductosPorCategoria(1).subscribe((productos) => {
      expect(productos).toEqual(dummyProductos);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msProductos}/categoria/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProductos);
  });
});
