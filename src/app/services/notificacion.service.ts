import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private readonly notificationService: NzNotificationService) { }

  abrirNotificacionError(titulo: string, contenido?: string) {
    this.notificationService.create('error', titulo, contenido ?? '');
  }

  abrirNotificacionExito(titulo: string, contenido?: string) {
    this.notificationService.create('success', titulo, contenido ?? '');
  }

  abrirNotificacionAdvertencia(titulo: string, contenido?: string, opciones?: any) {
    this.notificationService.create('warning', titulo, contenido ?? '', opciones);
  }
}
