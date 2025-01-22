import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NzModalService } from 'ng-zorro-antd/modal';
import { By } from '@angular/platform-browser';

import { InicioComponent } from './inicio.component';
import { AuthService } from '../../services/auth.service';
import { InicioService } from '../../services/inicio.service';
import { ModalLoginComponent } from '../login/modal-login.component';
import { Router } from '@angular/router';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let inicioServiceSpy: jasmine.SpyObj<InicioService>;
  let nzModalService: jasmine.SpyObj<NzModalService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLogged', 'logout']);
    const inicioSpy = jasmine.createSpyObj('InicioService', ['bienvenida']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const nzModalServiceSpy = jasmine.createSpyObj('NzModalService', ['create']);
    const mockNzModalRef = {
        afterClose: of()
    };
    nzModalServiceSpy.create.and.returnValue(mockNzModalRef);
    inicioSpy.bienvenida.and.returnValue(of('Bienvenido a mi aplicación'));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        NzButtonModule
      ],
      providers: [
        InicioComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NzModalService, useValue: nzModalServiceSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: InicioService, useValue: inicioSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    inicioServiceSpy = TestBed.inject(InicioService) as jasmine.SpyObj<InicioService>;
    nzModalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe retornar verdadero si el usuario está logueado', () => {
    authServiceSpy.isLogged.and.returnValue(true);
    expect(component.isLogged).toBeTrue();
  });

  it('Debe retornar falso si el usuario no está logueado', () => {
    authServiceSpy.isLogged.and.returnValue(false);
    expect(component.isLogged).toBeFalse();
  });

  it('Debe mostrar el botón de Logout si el usuario está logueado', () => {
    authServiceSpy.isLogged.and.returnValue(true);
    fixture.detectChanges();
    const botonLogin = fixture.debugElement.query(By.css('#login'));
    const botonLogout = fixture.debugElement.query(By.css('#logout'));
    expect(botonLogin).toBeNull();
    expect(botonLogout).toBeDefined();
    expect(component.isLogged).toBeTrue();
  });

  it('Debe mostrar el botón de Autenticar si el usuario no está logueado', () => {
    authServiceSpy.isLogged.and.returnValue(false);
    fixture.detectChanges();
    const botonLogin = fixture.debugElement.query(By.css('#login'));
    const botonLogout = fixture.debugElement.query(By.css('#logout'));
    expect(botonLogin).toBeDefined();
    expect(botonLogout).toBeNull();
    expect(component.isLogged).toBeFalse();
  });

  it('Debe llamar al método logout del AuthService', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('Debe llamar al método obtenerMensajeBienvenida al inicializar el componente', () => {
    spyOn(component, 'obtenerMensajeBienvenida');
    component.ngOnInit();
    expect(component.obtenerMensajeBienvenida).toHaveBeenCalled();
  });

  it('Debe obtener el mensaje de bienvenida de forma exitosa', () => {
    const mensaje = 'Bienvenido a mi aplicación de prueba';
    inicioServiceSpy.bienvenida.and.returnValue(of(mensaje));
    component.obtenerMensajeBienvenida();
    expect(component.mensaje).toBe(mensaje);
  });

  it('Debe al intentar obtener el mensaje de bienvenida, retornar un error cuando falle', () => {
    component.mensaje = '';
    inicioServiceSpy.bienvenida.and.returnValue(throwError(() => new Error('Error al obtener el mensaje de bienvenida')));
    component.obtenerMensajeBienvenida();
    expect(component.mensaje).toBe('');
  });

  it('Debe mostrar el modal de login', () => {
    component.mostrarLogin();
    expect(nzModalService.create).toHaveBeenCalled();
  });

  it('Debe abrir el modal de login después de cerrar el modal navegar al inicio', () => {
    const afterCloseSubject = of(null);
    nzModalService.create.and.returnValue({
      afterClose: afterCloseSubject
    } as any);

    component.mostrarLogin();

    expect(nzModalService.create).toHaveBeenCalledWith({
      nzContent: ModalLoginComponent,
      nzTitle: 'Iniciar sesión',
      nzClosable: false,
      nzFooter: null
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
