import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoriaListaComponent } from './categoria-lista.component';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria';
import { CategoriaTestDataBuilder } from '../../../models/categoria.builder.spec';

describe('CategoriaListaComponent', () => {
  let component: CategoriaListaComponent;
  let fixture: ComponentFixture<CategoriaListaComponent>;
  let categoriaServiceSpy: jasmine.SpyObj<CategoriaService>;

  beforeEach(async () => {
    const categoriaSpy = jasmine.createSpyObj('CategoriaService', ['consultar']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, NzTableModule, NzIconModule, CategoriaListaComponent],
      providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            { provide: CategoriaService, useValue: categoriaSpy }
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaListaComponent);
    component = fixture.componentInstance;
    categoriaServiceSpy = TestBed.inject(CategoriaService) as jasmine.SpyObj<CategoriaService>;
    categoriaServiceSpy.consultar.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe listar categorías al inicializar el componente', () => {
    const categorias: Categoria[] = [new CategoriaTestDataBuilder().build()];
    categoriaServiceSpy.consultar.and.returnValue(of(categorias));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categorias).toEqual(categorias);
    expect(component.cargando).toBeFalse();
  });

  it('Debe mostrar un mensaje de error si la consulta de categorías falla', () => {
    categoriaServiceSpy.consultar.and.returnValue(throwError(() => new Error('Error al consultar categorías')));

    component.listarCategorias();
    fixture.detectChanges();

    expect(component.cargando).toBeFalse();
    expect(component.categorias.length).toBe(0);
  });

  it('Debe mostrar las categorías en la tabla', () => {
    const categorias: Categoria[] = [{ id: '1', nombre: 'Categoría 1' }];
    component.categorias = categorias;
    component.cargando = false;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(categorias.length);
    expect(rows[0].nativeElement.textContent).toContain('1');
    expect(rows[0].nativeElement.textContent).toContain('Categoría 1');

    const idCategoria = fixture.debugElement.query(By.css('#categoria-id-0')).nativeElement;
    const nombreCategoria = fixture.debugElement.query(By.css('#categoria-nombre-0')).nativeElement;

    expect(idCategoria.textContent).toContain('1');
    expect(nombreCategoria.textContent).toContain('Categoría 1');
  });
});
