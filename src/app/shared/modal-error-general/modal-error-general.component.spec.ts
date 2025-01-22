import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { ModalErrorGeneralComponent } from './modal-error-general.component';
import { Mensaje } from '../../models/mensaje';

describe('ModalErrorGeneralComponent', () => {
  let component: ModalErrorGeneralComponent;
  let fixture: ComponentFixture<ModalErrorGeneralComponent>;
  let modalRefSpy: jasmine.SpyObj<NzModalRef>;

  beforeEach(async () => {
    const modalRefSpyObj = jasmine.createSpyObj('NzModalRef', ['close']);
    const mensajeEntrada: Mensaje = { detail: 'Mensaje de error' };

    await TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule, NzButtonModule, NzModalModule],
      providers: [
        { provide: NzModalRef, useValue: modalRefSpyObj },
        { provide: NZ_MODAL_DATA, useValue: mensajeEntrada }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalErrorGeneralComponent);
    component = fixture.componentInstance;
    modalRefSpy = TestBed.inject(NzModalRef) as jasmine.SpyObj<NzModalRef>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe mostrar el mensaje de error', () => {
    const tituloErrorElement = fixture.debugElement.query(By.css('#titulo-error')).nativeElement;
    const mensajeErrorElement = fixture.debugElement.query(By.css('#mensaje-error')).nativeElement;
    expect(tituloErrorElement.textContent).toContain('¡Atención!');
    expect(mensajeErrorElement.textContent).toContain('Mensaje de error');
  });

  xit('Debe cerrar el modal al hacer clic en el botón', () => {
    const botonModal = fixture.debugElement.query(By.css('#boton-modal'));
    expect(botonModal).toBeTruthy();
    botonModal.nativeElement.click();
    expect(modalRefSpy.close).toHaveBeenCalled();
  });
});
