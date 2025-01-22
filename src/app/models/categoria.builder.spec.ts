import { Categoria } from './categoria';

export class CategoriaTestDataBuilder {
  private categoria: Categoria;

  constructor() {
    this.categoria = {
      id: '1',
      nombre: 'Categoría de ejemplo'
    };
  }

  withId(id: string): this {
    this.categoria.id = id;
    return this;
  }

  withNombre(nombre: string): this {
    this.categoria.nombre = nombre;
    return this;
  }

  build(): Categoria {
    return this.categoria;
  }
}
