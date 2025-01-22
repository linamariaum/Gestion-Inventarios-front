import { Cliente } from './cliente';

export class ClienteTestDataBuilder {
  private cliente: Cliente;

  constructor() {
    this.cliente = {
      id: '1',
      nombre: 'Cliente de prueba',
      email: 'cliente@prueba.com',
      telefono: '123456789'
    };
  }

  withId(id: string): ClienteTestDataBuilder {
    this.cliente.id = id;
    return this;
  }

  withNombre(nombre: string): ClienteTestDataBuilder {
    this.cliente.nombre = nombre;
    return this;
  }

  withEmail(email: string): ClienteTestDataBuilder {
    this.cliente.email = email;
    return this;
  }

  withTelefono(telefono: string): ClienteTestDataBuilder {
    this.cliente.telefono = telefono;
    return this;
  }

  build(): Cliente {
    return this.cliente;
  }
}
