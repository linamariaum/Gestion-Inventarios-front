import { Producto } from './producto';
import { Categoria } from './categoria';
import { CategoriaTestDataBuilder } from './categoria.builder.spec';

export class ProductoTestDataBuilder {
  private producto: Producto;

  constructor() {
    this.producto = {
      id: '1',
      nombre: 'Producto de prueba',
      precio: 100,
      cantidad: 10,
      categoria: new CategoriaTestDataBuilder().build()
    };
  }

  withId(id: string): ProductoTestDataBuilder {
    this.producto.id = id;
    return this;
  }

  withNombre(nombre: string): ProductoTestDataBuilder {
    this.producto.nombre = nombre;
    return this;
  }

  withPrecio(precio: number): ProductoTestDataBuilder {
    this.producto.precio = precio;
    return this;
  }

  withCantidad(cantidad: number): ProductoTestDataBuilder {
    this.producto.cantidad = cantidad;
    return this;
  }

  withCategoria(categoria: Categoria): ProductoTestDataBuilder {
    this.producto.categoria = categoria;
    return this;
  }

  build(): Producto {
    return this.producto;
  }
}
