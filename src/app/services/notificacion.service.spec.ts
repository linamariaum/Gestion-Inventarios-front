import { TestBed } from '@angular/core/testing';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  let service: NotificacionService;
  let notificationServiceSpy: jasmine.SpyObj<NzNotificationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NzNotificationService', ['create']);

    TestBed.configureTestingModule({
      providers: [
        NotificacionService,
        { provide: NzNotificationService, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificacionService);
    notificationServiceSpy = TestBed.inject(NzNotificationService) as jasmine.SpyObj<NzNotificationService>;
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe abrir la notificación de error con el contenido especificado', () => {
    const titulo = 'Error';
    const contenido = 'Ha ocurrido un error';
    service.abrirNotificacionError(titulo, contenido);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('error', titulo, contenido);
  });

  it('Debe abrir la notificación de error con el contenido por default', () => {
    const titulo = 'Error';
    service.abrirNotificacionError(titulo);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('error', titulo, '');
  });

  it('Debe abrir la notificación de exito con el contenido especificado', () => {
    const titulo = 'Éxito';
    const contenido = 'Operación exitosa';
    service.abrirNotificacionExito(titulo, contenido);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('success', titulo, contenido);
  });

  it('Debe abrir la notificación de exito con el contenido por default', () => {
    const titulo = 'Éxito';
    service.abrirNotificacionExito(titulo);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('success', titulo, '');
  });

  it('Debe abrir la notificación de advertencia con el contenido especificado y las opciones especificadas', () => {
    const titulo = 'Advertencia';
    const contenido = 'Esta es una advertencia';
    const opciones = { nzDuration: 3000 };
    service.abrirNotificacionAdvertencia(titulo, contenido, opciones);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('warning', titulo, contenido, opciones);
  });

  it('Debe abrir la notificación de advertencia con el contenido y opciones por default', () => {
    const titulo = 'Advertencia';
    service.abrirNotificacionAdvertencia(titulo);
    expect(notificationServiceSpy.create).toHaveBeenCalledWith('warning', titulo, '', undefined);
  });
});
