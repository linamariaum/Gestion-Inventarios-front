import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoriaComponent } from './categoria.component';
import { CategoriaListaComponent } from './categoria-lista/categoria-lista.component';
import { AuthService } from '../../services/auth.service';
import { CategoriaCreacionComponent } from './categoria-creacion/categoria-creacion.component';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let nzModalServiceSpy: jasmine.SpyObj<NzModalService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAdministrador']);
    const modalSpy = jasmine.createSpyObj('NzModalService', ['create']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, CategoriaListaComponent, NzButtonModule, CategoriaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: NzModalService, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    nzModalServiceSpy = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe mostrar el botón "Crear Categoría" si el usuario es administrador', () => {
    authServiceSpy.isAdministrador.and.returnValue(true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#crear-categoria'));
    expect(button).toBeTruthy();
  });

  it('No debe mostrar el botón "Crear Categoría" si el usuario no es administrador', () => {
    authServiceSpy.isAdministrador.and.returnValue(false);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#crear-categoria'));
    expect(button).toBeNull();
  });

  it('Debe abrir el modal de creación de categoría al hacer clic en el botón "Crear Categoría"', () => {
    authServiceSpy.isAdministrador.and.returnValue(true);
    fixture.detectChanges();

    const modalRefSpy = jasmine.createSpyObj('NzModalRef', ['afterClose']);
    modalRefSpy.afterClose.and.returnValue(of(null));
    nzModalServiceSpy.create.and.returnValue(modalRefSpy);

    const button = fixture.debugElement.query(By.css('#crear-categoria')).nativeElement;
    button.click();

    expect(nzModalServiceSpy.create).toHaveBeenCalledWith({
      nzContent: CategoriaCreacionComponent,
      nzTitle: 'Crear categoría',
      nzClosable: false,
      nzFooter: null
    });
  });

  it('Debe llamar a listarCategorias después de cerrar el modal de creación de categoría', () => {
    const afterCloseSubject = of(null);
    nzModalServiceSpy.create.and.returnValue({
      afterClose: afterCloseSubject
    } as any);
    const listarCategoriasSpy = spyOn(component.categoriaListaComponent, 'listarCategorias');

    component.crearCategoria();

    expect(nzModalServiceSpy.create).toHaveBeenCalled();
    expect(listarCategoriasSpy).toHaveBeenCalled();
  });
});
