import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CategoriaService } from './categoria.service';
import { ConstantesRutas } from '../core/constantes-rutas';
import { Categoria } from '../models/categoria';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe crear una categoría', () => {
    const dummyResponse: Categoria = { id: '1', nombre: 'Categoría 1' };
    const dummyCategoria: Categoria = { nombre: 'Categoría 1' };

    service.crear(dummyCategoria).subscribe((categoria) => {
      expect(categoria).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msCategorias}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('Debe consultar la lista de categorías', () => {
    const dummyCategorias: Categoria[] = [
      { id: '1', nombre: 'Categoría 1' },
      { id: '2', nombre: 'Categoría 2' }
    ];

    service.consultar().subscribe((categorias) => {
      expect(categorias).toEqual(dummyCategorias);
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msCategorias}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategorias);
  });

  it('Debe realizar la carga masiva de categorías', () => {
    const dummyFile = new File(['content'], 'categorias.csv', { type: 'text/csv' });

    service.cargaMasiva(dummyFile).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${ConstantesRutas.msCategorias}/carga-masiva`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
