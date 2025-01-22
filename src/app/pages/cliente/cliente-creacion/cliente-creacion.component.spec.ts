import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { ContactsOutline, MailOutline, PhoneOutline, UserOutline, LockOutline } from '@ant-design/icons-angular/icons';
import { of, throwError } from 'rxjs';

import { ClienteCreacionComponent } from './cliente-creacion.component';
import { NotificacionService } from '../../../services/notificacion.service';
import { ClienteService } from '../../../services/cliente.service';
import { UtilidadesFormulario } from '../../../shared/utilidades-formulario';
import { ClienteTestDataBuilder } from '../../../models/cliente.builder.spec';

describe('ClienteCreacionComponent', () => {
  let component: ClienteCreacionComponent;
  let fixture: ComponentFixture<ClienteCreacionComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;
  let nzModalRefSpy: jasmine.SpyObj<NzModalRef>;

  beforeEach(async () => {
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['crear']);
    const notificacionSpy = jasmine.createSpyObj('NotificacionService', ['abrirNotificacionExito', 'abrirNotificacionError']);
    const modalSpy = jasmine.createSpyObj('NzModalRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        BrowserAnimationsModule,
        NzIconModule,
        ClienteCreacionComponent
      ],
      providers: [
        { provide: ClienteService, useValue: clienteSpy },
        { provide: NotificacionService, useValue: notificacionSpy },
        { provide: NzModalRef, useValue: modalSpy },
        { provide: NZ_ICONS, useValue: [ContactsOutline, MailOutline, PhoneOutline, UserOutline, LockOutline] }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteCreacionComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    notificacionServiceSpy = TestBed.inject(NotificacionService) as jasmine.SpyObj<NotificacionService>;
    nzModalRefSpy = TestBed.inject(NzModalRef) as jasmine.SpyObj<NzModalRef>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario al inicializar el componente', () => {
    component.ngOnInit();
    expect(component.formularioCliente).toBeDefined();
    expect(component.formularioCliente.controls['nombre']).toBeDefined();
    expect(component.formularioCliente.controls['nombre'].value).toBeNull();
    expect(component.formularioCliente.controls['email']).toBeDefined();
    expect(component.formularioCliente.controls['telefono']).toBeDefined();
    expect(component.formularioCliente.controls['username']).toBeDefined();
    expect(component.formularioCliente.controls['rol']).toBeDefined();
    expect(component.formularioCliente.controls['rol'].value).toEqual('cliente');
    expect(component.formularioCliente.controls['password']).toBeDefined();
  });

  it('Debe mostrar un mensaje de error si el formulario es inválido al intentar crear un cliente', () => {
    spyOn(UtilidadesFormulario, 'marcarErroresControlesFormulario');
    component.crearCliente();
    expect(UtilidadesFormulario.marcarErroresControlesFormulario).toHaveBeenCalledWith(component.formularioCliente.controls);
  });

  it('Debe crear un cliente y mostrar un mensaje de éxito cuando el formulario es válido', () => {
    component.formularioCliente.controls['nombre'].setValue('Nuevo Cliente');
    component.formularioCliente.controls['email'].setValue('cliente@example.com');
    component.formularioCliente.controls['telefono'].setValue('123456789');
    component.formularioCliente.controls['username'].setValue('cliente');
    component.formularioCliente.controls['rol'].setValue('cliente');
    component.formularioCliente.controls['password'].setValue('password123');
    clienteServiceSpy.crear.and.returnValue(of(new ClienteTestDataBuilder().build()));

    component.crearCliente();

    expect(clienteServiceSpy.crear).toHaveBeenCalledWith({
      nombre: 'Nuevo Cliente',
      email: 'cliente@example.com',
      telefono: '123456789',
      username: 'cliente',
      rol: 'cliente',
      password: 'password123'
    });
    expect(notificacionServiceSpy.abrirNotificacionExito).toHaveBeenCalledWith('Cliente creado correctamente');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });

  it('Debe mostrar un mensaje de error si la creación del cliente falla', () => {
    component.formularioCliente.controls['nombre'].setValue('Nuevo Cliente');
    component.formularioCliente.controls['email'].setValue('cliente@example.com');
    component.formularioCliente.controls['telefono'].setValue('123456789');
    component.formularioCliente.controls['username'].setValue('cliente');
    component.formularioCliente.controls['rol'].setValue('cliente');
    component.formularioCliente.controls['password'].setValue('password123');
    clienteServiceSpy.crear.and.returnValue(throwError(() => new Error('Error al crear cliente')));

    component.crearCliente();

    expect(clienteServiceSpy.crear).toHaveBeenCalledWith({
      nombre: 'Nuevo Cliente',
      email: 'cliente@example.com',
      telefono: '123456789',
      username: 'cliente',
      rol: 'cliente',
      password: 'password123'
    });
    expect(notificacionServiceSpy.abrirNotificacionError).toHaveBeenCalledWith('Error al crear cliente');
    expect(nzModalRefSpy.close).toHaveBeenCalled();
  });
});
