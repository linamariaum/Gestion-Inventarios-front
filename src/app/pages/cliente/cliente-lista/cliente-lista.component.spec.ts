import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Cliente } from '../../../models/cliente';
import { ClienteListaComponent } from './cliente-lista.component';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteTestDataBuilder } from '../../../models/cliente.builder.spec';

describe('ClienteListaComponent', () => {
  let component: ClienteListaComponent;
  let fixture: ComponentFixture<ClienteListaComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['consultarClientes']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule, ClienteListaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ClienteService, useValue: clienteSpy }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteListaComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    clienteServiceSpy.consultarClientes.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe listar clientes al inicializar el componente', () => {
    const clientes: Cliente[] = [new ClienteTestDataBuilder().build()];
    clienteServiceSpy.consultarClientes.and.returnValue(of(clientes));

    component.ngOnInit();

    expect(component.clientes).toEqual(clientes);
    expect(component.cargando).toBeFalse();
  });

  it('Debe mostrar un mensaje de error si la consulta de clientes falla', () => {
    clienteServiceSpy.consultarClientes.and.returnValue(throwError(() => new Error('Error al consultar clientes')));

    component.listarClientes();

    expect(component.cargando).toBeFalse();
    expect(component.clientes.length).toBe(0);
  });

  it('Debe llamar a listarClientes al hacer clic en el botón de recarga', () => {
    spyOn(component, 'listarClientes');

    const button = fixture.debugElement.query(By.css('#btnRecargar')).nativeElement;
    button.click();

    expect(component.listarClientes).toHaveBeenCalled();
  });

  it('Debe mostrar los clientes en la tabla', () => {
    const clientes: Cliente[] = [{ id: '1', nombre: 'Cliente 1', email: 'cliente1@example.com', telefono: '123456789' }];
    component.clientes = clientes;
    component.cargando = false;
    fixture.detectChanges();

    const idCliente = fixture.debugElement.query(By.css('#cliente-id-0')).nativeElement;
    const nombreCliente = fixture.debugElement.query(By.css('#cliente-nombre-0')).nativeElement;
    const emailCliente = fixture.debugElement.query(By.css('#cliente-email-0')).nativeElement;
    const telefonoCliente = fixture.debugElement.query(By.css('#cliente-telefono-0')).nativeElement;

    expect(idCliente.textContent).toContain('1');
    expect(nombreCliente.textContent).toContain('Cliente 1');
    expect(emailCliente.textContent).toContain('cliente1@example.com');
    expect(telefonoCliente.textContent).toContain('123456789');
  });
});
