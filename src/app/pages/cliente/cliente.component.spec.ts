import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ClienteComponent } from './cliente.component';
import { ClienteListaComponent } from './cliente-lista/cliente-lista.component';
import { ClienteCreacionComponent } from './cliente-creacion/cliente-creacion.component';

describe('ClienteComponent', () => {
  let component: ClienteComponent;
  let fixture: ComponentFixture<ClienteComponent>;
  let nzModalServiceSpy: jasmine.SpyObj<NzModalService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NzModalService', ['create']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ClienteListaComponent, NzButtonModule],
      providers: [
        ClienteComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NzModalService, useValue: modalSpy }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteComponent);
    component = fixture.componentInstance;
    nzModalServiceSpy = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe abrir el modal de creación de cliente al hacer clic en el botón "Crear Cliente"', () => {
    const modalRefSpy = jasmine.createSpyObj('NzModalRef', ['afterClose']);
    modalRefSpy.afterClose.and.returnValue(of(null));
    nzModalServiceSpy.create.and.returnValue(modalRefSpy);

    const button = fixture.debugElement.query(By.css('#crear-cliente')).nativeElement;
    button.click();

    expect(nzModalServiceSpy.create).toHaveBeenCalledWith({
      nzContent: ClienteCreacionComponent,
      nzTitle: 'Crear cliente',
      nzClosable: false,
      nzFooter: null
    });
  });

  it('Debe llamar a listarClientes después de cerrar el modal de creación de cliente', () => {
    const afterCloseSubject = of(null);
    nzModalServiceSpy.create.and.returnValue({
      afterClose: afterCloseSubject
    } as any);
    const listarClientesSpy = spyOn(component.clienteListaComponent, 'listarClientes');

    component.crearCliente();

    expect(nzModalServiceSpy.create).toHaveBeenCalled();
    expect(listarClientesSpy).toHaveBeenCalled();
  });
});
