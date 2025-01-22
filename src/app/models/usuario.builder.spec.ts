import { Usuario } from './usuario';

export class UsuarioTestDataBuilder {
  private usuario: Usuario;

  constructor() {
    this.usuario = {
      username: 'testuser',
      rol: 'admin'
    };
  }

  withUsername(username: string): this {
    this.usuario.username = username;
    return this;
  }

  withRol(rol: string): this {
    this.usuario.rol = rol;
    return this;
  }

  build(): Usuario {
    return this.usuario;
  }
}